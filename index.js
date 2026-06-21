import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.json({ message: 'Gemini Flash API is running!' });
});

app.post('/api/chat', async (req, res) => {
  const { conversation, config, apiKey: customApiKey } = req.body;
  try {
    if (!Array.isArray(conversation)) throw new Error('Messages must be an array!');

    // Use custom API key if provided, otherwise use .env key
    const keyToUse = customApiKey || process.env.GEMINI_API_KEY;
    if (!keyToUse) {
      throw new Error('No API key provided. Please set GEMINI_API_KEY in settings or .env');
    }

    const aiInstance = new GoogleGenAI({ apiKey: keyToUse });

    const contents = conversation.map(({ role, text }) => ({
      role,
      parts: [{ text }]
    }));

    const response = await aiInstance.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        temperature: config?.temperature || 0.9,
        topP: config?.topP || 0.9,
        topK: config?.topK || 40,
        systemInstruction: config?.systemInstruction || "Jawab hanya menggunakan bahasa Indonesia.",
      },
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

