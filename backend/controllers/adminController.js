const User = require('../models/User');
const WasteSubmission = require('../models/WasteSubmission');
const TraceabilityLog = require('../models/TraceabilityLog');

// Export waste data as CSV
exports.exportCSV = async (req, res) => {
  try {
    const waste = await WasteSubmission.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const rows = [
      ['Waste ID', 'Category', 'Weight (kg)', 'Status', 'Points', 'Submitted By', 'Email', 'Date'],
      ...waste.map(w => [
        w.wasteId, w.category, w.weight, w.status, w.pointsAwarded,
        w.userId?.name || '', w.userId?.email || '',
        new Date(w.createdAt).toLocaleDateString()
      ])
    ];

    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=wastechain-export.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard analytics
exports.getAnalytics = async (req, res) => {
  try {
    // Total waste collected
    const totalWaste = await WasteSubmission.countDocuments();
    
    // Total weight
    const wasteStats = await WasteSubmission.aggregate([
      {
        $group: {
          _id: null,
          totalWeight: { $sum: '$weight' },
          totalPoints: { $sum: '$pointsAwarded' }
        }
      }
    ]);

    // Waste by category
    const wasteByCategory = await WasteSubmission.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          weight: { $sum: '$weight' }
        }
      }
    ]);

    // Waste by status
    const wasteByStatus = await WasteSubmission.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly trends
    const monthlyTrends = await WasteSubmission.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          weight: { $sum: '$weight' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // Top users
    const topUsers = await User.find({ role: 'citizen' })
      .select('name email points level')
      .sort({ points: -1 })
      .limit(10);

    // User counts by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalWaste,
      totalWeight: wasteStats[0]?.totalWeight || 0,
      totalPoints: wasteStats[0]?.totalPoints || 0,
      wasteByCategory,
      wasteByStatus,
      monthlyTrends,
      topUsers,
      usersByRole
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin user' });
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve recycler
exports.approveRecycler = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'recycler') {
      return res.status(400).json({ message: 'User is not a recycler' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: 'Recycler approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all traceability logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await TraceabilityLog.find()
      .populate('performedBy', 'name role')
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
