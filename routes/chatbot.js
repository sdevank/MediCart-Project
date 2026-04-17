const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Initialize Gemini AI with your secret key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        // 2. Select the fast and free Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // 3. Give the AI a "Personality" and Context!
        const prompt = `You are an intelligent and helpful AI assistant for an online pharmacy named 'MediCart'. 
        You help users with general health advice, explain what medicines are used for, and guide them on how to use the website. 
        Always be polite, professional, and concise. 
        IMPORTANT DISCLAIMER: Always remind users to consult a real doctor for serious issues.
        
        User's question: ${userMessage}`;
        
        // 4. Ask the AI and wait for the response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // 5. Send the AI's answer back to the frontend
        res.status(200).json({ reply: text });

    } catch (err) {
        console.error("AI Error:", err);
        res.status(500).json({ reply: "I'm having trouble connecting to my AI servers right now. Please try again in a moment." });
    }
});

module.exports = router;