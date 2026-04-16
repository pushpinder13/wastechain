const QRCode = require('qrcode');
const WasteSubmission = require('../models/WasteSubmission');
const TraceabilityLog = require('../models/TraceabilityLog');
const User = require('../models/User');

// Delete waste submission
exports.deleteWaste = async (req, res) => {
  try {
    const waste = await WasteSubmission.findById(req.params.id);

    if (!waste) {
      return res.status(404).json({ message: 'Waste not found' });
    }

    // Check if user is the owner of the submission
    if (waste.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Deduct points from user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: -waste.pointsAwarded }
    });

    // Delete traceability logs
    await TraceabilityLog.deleteMany({ wasteId: waste.wasteId });

    // Delete the waste submission
    await waste.deleteOne();

    res.json({ message: 'Waste submission removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate unique waste ID
const generateWasteId = () => {
  return 'WC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Calculate points based on category
const calculatePoints = (category, weight) => {
  const pointsMap = {
    'Plastic': 10,
    'Paper': 8,
    'Metal': 20,
    'Glass': 12,
    'E-waste': 25,
    'Organic': 5,
    'Other': 5
  };
  return (pointsMap[category] || 10) * Math.ceil(weight);
};

// Update user level based on points
const updateUserLevel = async (userId) => {
  const user = await User.findById(userId);
  if (user.points >= 500) {
    user.level = 'Recycling Hero';
    if (!user.badges.find(b => b.name === 'Recycling Hero')) {
      user.badges.push({ name: 'Recycling Hero', earnedAt: new Date() });
    }
  } else if (user.points >= 200) {
    user.level = 'Green Champion';
    if (!user.badges.find(b => b.name === 'Green Champion')) {
      user.badges.push({ name: 'Green Champion', earnedAt: new Date() });
    }
  } else if (user.points >= 50) {
    user.level = 'Eco Warrior';
    if (!user.badges.find(b => b.name === 'Eco Warrior')) {
      user.badges.push({ name: 'Eco Warrior', earnedAt: new Date() });
    }
  }
  await user.save();
};

// Create waste submission
exports.createWaste = async (req, res) => {
  try {
    const { category, weight, description, address } = req.body;
    const wasteId = generateWasteId();

    // Generate QR code
    const qrCodeData = await QRCode.toDataURL(wasteId);

    // Calculate points
    const points = calculatePoints(category, weight);

    // Create waste submission
    const waste = await WasteSubmission.create({
      wasteId,
      userId: req.user._id,
      category,
      weight,
      description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      qrCode: qrCodeData,
      location: { address },
      pointsAwarded: points
    });

    // Update user points
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: points }
    });

    // Update user level
    await updateUserLevel(req.user._id);

    // Create traceability log
    await TraceabilityLog.create({
      wasteId,
      action: 'Waste Created',
      performedBy: req.user._id,
      performedByRole: req.user.role,
      metadata: { category, weight }
    });

    res.status(201).json(waste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all waste submissions (with filters + pagination)
exports.getAllWaste = async (req, res) => {
  try {
    const { status, category, userId, collectorId, recyclerId, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (userId) filter.userId = userId;
    if (collectorId) filter.collectorId = collectorId;
    if (recyclerId) filter.recyclerId = recyclerId;
    if (search) filter.$or = [
      { wasteId: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await WasteSubmission.countDocuments(filter);

    const waste = await WasteSubmission.find(filter)
      .populate('userId', 'name email')
      .populate('collectorId', 'name phone')
      .populate('recyclerId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ waste, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get waste by ID
exports.getWasteById = async (req, res) => {
  try {
    const waste = await WasteSubmission.findOne({ wasteId: req.params.id })
      .populate('userId', 'name email phone address')
      .populate('collectorId', 'name phone')
      .populate('recyclerId', 'name');

    if (!waste) {
      return res.status(404).json({ message: 'Waste not found' });
    }

    res.json(waste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update waste status
exports.updateWasteStatus = async (req, res) => {
  const { status, collectorId, recyclerId } = req.body;
  const { id } = req.params;
  let retries = 3;

  while (retries > 0) {
    try {
      const waste = await WasteSubmission.findOne({ wasteId: id });

      if (!waste) {
        return res.status(404).json({ message: 'Waste not found' });
      }

      const originalStatus = waste.status;
      waste.status = status;
      waste.updatedAt = new Date();

      if (collectorId) waste.collectorId = collectorId;
      if (recyclerId) waste.recyclerId = recyclerId;

      await waste.save();

      if (originalStatus !== status) {
        const lastLog = await TraceabilityLog.findOne({ wasteId: waste.wasteId }).sort({ timestamp: -1 });
        await TraceabilityLog.create({
          wasteId: waste.wasteId,
          action: `Status Updated to ${status}`,
          performedBy: req.user._id,
          performedByRole: req.user.role,
          previousHash: lastLog ? lastLog.currentHash : '0',
          metadata: { status }
        });

        // Real-time notification to waste owner
        const io = req.app.get('io');
        if (io) {
          io.to(waste.userId.toString()).emit('wasteStatusUpdate', {
            wasteId: waste.wasteId,
            status,
            message: `Your waste ${waste.wasteId} status updated to: ${status}`
          });
        }
      }

      return res.json(waste);

    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.['wasteId'] === 1) {
        retries--;
        if (retries === 0) return res.status(500).json({ message: 'Failed after multiple attempts. Please try again.' });
        await new Promise(resolve => setTimeout(resolve, 50));
      } else {
        return res.status(500).json({ message: error.message });
      }
    }
  }
};

// Get waste traceability
exports.getWasteTrace = async (req, res) => {
  try {
    const logs = await TraceabilityLog.find({ wasteId: req.params.id })
      .populate('performedBy', 'name role')
      .sort({ timestamp: 1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get nearby waste for collectors
exports.getNearbyWaste = async (req, res) => {
  try {
    const waste = await WasteSubmission.find({ 
      status: { $in: ['Submitted', 'Pickup Scheduled'] }
    })
      .populate('userId', 'name phone address')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(waste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get collector statistics
exports.getCollectorStats = async (req, res) => {
  try {
    const collectorId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const collectionsToday = await WasteSubmission.countDocuments({
      collectorId,
      status: 'Collected',
      updatedAt: { $gte: today }
    });

    const totalEarnings = await WasteSubmission.aggregate([
      {
        $match: {
          collectorId: collectorId,
          status: 'Collected'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$weight', 0.5] } } // Example: $0.5 per kg
        }
      }
    ]);

    res.json({
      collectionsToday,
      totalEarnings: totalEarnings[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
