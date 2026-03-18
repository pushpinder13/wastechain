const express = require('express');
const router = express.Router();
const {
  createWaste,
  getAllWaste,
  getWasteById,
  updateWasteStatus,
  getWasteTrace,
  getNearbyWaste,
  getCollectorStats,
  deleteWaste,
} = require('../controllers/wasteController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, authorize('citizen'), upload.single('image'), createWaste);
router.get('/', protect, getAllWaste);
router.get('/nearby', protect, authorize('collector'), getNearbyWaste);
router.get('/stats/collector', protect, authorize('collector'), getCollectorStats);
router.get('/:id', getWasteById);
router.delete('/:id', protect, deleteWaste);
router.put('/:id/status', protect, updateWasteStatus);
router.get('/:id/trace', getWasteTrace);

module.exports = router;

