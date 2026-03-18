const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getAllUsers,
  approveRecycler,
  getAllLogs
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/approve', protect, authorize('admin'), approveRecycler);
router.get('/logs', protect, authorize('admin'), getAllLogs);

module.exports = router;
