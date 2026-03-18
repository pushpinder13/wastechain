const express = require('express');
const router = express.Router();
const { analyzeWasteImage } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/analyze-image', protect, upload.single('image'), analyzeWasteImage);

module.exports = router;
