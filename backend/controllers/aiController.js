const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeWasteImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const imageData = {
      inlineData: {
        data: Buffer.from(fs.readFileSync(req.file.path)).toString('base64'),
        mimeType: req.file.mimetype
      }
    };

    const prompt = `Analyze this waste image and return ONLY a valid JSON object with no markdown, no extra text:
{
  "type": "one of: Plastic, Paper, Metal, Glass, E-waste, Organic, Other",
  "recyclable": true or false,
  "disposalInstructions": "brief disposal instructions",
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

    const result = await model.generateContent([prompt, imageData]);
    const text = result.response.text().trim();

    let prediction;
    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      prediction = JSON.parse(cleaned);
    } catch {
      prediction = { type: 'Other', recyclable: false, disposalInstructions: text, suggestions: [] };
    }

    res.json({ success: true, imageUrl: `/uploads/${req.file.filename}`, prediction });

  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ message: 'Error analyzing image with AI: ' + error.message });
  }
};
