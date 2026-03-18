const mongoose = require('mongoose');
const crypto = require('crypto');

const traceabilityLogSchema = new mongoose.Schema({
  wasteId: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  performedByRole: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  previousHash: {
    type: String,
    default: '0'
  },
  currentHash: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
});

// Add compound index for preventing race conditions
traceabilityLogSchema.index({ wasteId: 1, previousHash: 1 }, { unique: true });


// Generate hash before saving
traceabilityLogSchema.pre('save', function(next) {
  const data = `${this.wasteId}${this.action}${this.performedBy}${this.timestamp}${this.previousHash}`;
  this.currentHash = crypto.createHash('sha256').update(data).digest('hex');
  next();
});

module.exports = mongoose.model('TraceabilityLog', traceabilityLogSchema);
