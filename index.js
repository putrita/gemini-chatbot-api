const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config(); // Panggil config setelah dotenv di-require

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Gemini setup
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Menggunakan nama model yang umum digunakan dengan SDK ini dan format yang benar
// Sebaiknya periksa dokumentasi SDK versi ini untuk nama model yang paling sesuai jika bukan 'gemini-1.5-flash'
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

app.listen(port, () => {
  console.log(`Gemini chatbot running on http://localhost:${port}`);
});

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage){
        return res.status(400).json({ reply: "Message is required." });
    }

    try{
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();

        res.json({reply: text });
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Something went wrong"});
    
    }
});