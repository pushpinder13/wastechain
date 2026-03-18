const mongoose = require('mongoose');

const wasteSubmissionSchema = new mongoose.Schema({
  wasteId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['Plastic', 'Paper', 'Metal', 'Glass', 'E-waste'],
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String
  },
  qrCode: {
    type: String
  },
  status: {
    type: String,
    enum: ['Submitted', 'Pickup Scheduled', 'Collected', 'Delivered to Recycler', 'Recycled'],
    default: 'Submitted'
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  aiDetection: {
    predictedType: String,
    confidence: Number
  },
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recyclerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pointsAwarded: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WasteSubmission', wasteSubmissionSchema);
