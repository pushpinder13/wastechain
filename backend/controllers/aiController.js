const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

// Analyze waste image (with file upload)
exports.analyzeWasteImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the image of waste and identify the material. 
    Return a JSON object with the following structure:
    {
      "type": "The type of waste (e.g., Plastic, Paper, Metal, Glass, E-waste, Organic, etc.)",
      "recyclable": "A boolean indicating if the item is recyclable",
      "disposalInstructions": "A short paragraph on how to properly dispose of the item.",
      "suggestions": [
        "A list of suggestions for recycling or reusing the item."
      ]
    }
    Only return the JSON object, with no other text or markdown.
    `;

    const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean the response to get only the JSON
    const jsonResponse = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());

    res.json({
      success: true,
      imageUrl: `/uploads/${req.file.filename}`,
      prediction: jsonResponse
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error analyzing image with AI" });
  }
};
