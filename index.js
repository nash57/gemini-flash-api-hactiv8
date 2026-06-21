import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
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
        systemInstruction: config?.systemInstruction || "Jawab hanya menggunakan bahasa Indonesia gaul.",
      },
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ====== UPDATE .ENV FILE ======
app.post('/api/update-env', (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({ error: 'Invalid API key provided' });
    }

    const envPath = path.join(__dirname, '.env');
    const envContent = `GEMINI_API_KEY="${apiKey}"`;

    // Write to .env file
    fs.writeFileSync(envPath, envContent, 'utf8');

    // Update process.env for immediate use in this session
    process.env.GEMINI_API_KEY = apiKey;

    console.log('✅ API key updated in .env');
    
    res.status(200).json({ 
      message: 'API key updated successfully',
      updated: true 
    });
  } catch (error) {
    console.error('Error updating .env file:', error);
    res.status(500).json({ error: 'Failed to update API key: ' + error.message });
  }
});

// ====== SAVE CONFIGURATION ======
app.post('/api/save-config', (req, res) => {
  try {
    const { temperature, topP, topK, systemInstruction } = req.body;

    // Validate input
    if (temperature === undefined || topP === undefined || topK === undefined || !systemInstruction) {
      return res.status(400).json({ error: 'Missing required configuration fields' });
    }

    const configPath = path.join(__dirname, 'config.json');
    const configContent = {
      temperature: parseFloat(temperature),
      topP: parseFloat(topP),
      topK: parseInt(topK),
      systemInstruction: String(systemInstruction)
    };

    // Write to config.json file
    fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2), 'utf8');

    console.log('✅ Configuration saved:', configContent);
    
    res.status(200).json({ 
      message: 'Configuration saved successfully',
      saved: true,
      config: configContent
    });
  } catch (error) {
    console.error('Error saving configuration:', error);
    res.status(500).json({ error: 'Failed to save configuration: ' + error.message });
  }
});

// ====== GET CONFIGURATION ======
app.get('/api/get-config', (req, res) => {
  try {
    const configPath = path.join(__dirname, 'config.json');
    
    // Return default config if file doesn't exist
    if (!fs.existsSync(configPath)) {
      const defaultConfig = {
        temperature: 0.9,
        topP: 0.9,
        topK: 40,
        systemInstruction: "Jawab hanya menggunakan bahasa Indonesia gaul."
      };
      return res.status(200).json(defaultConfig);
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    
    res.status(200).json(config);
  } catch (error) {
    console.error('Error reading configuration:', error);
    res.status(500).json({ error: 'Failed to read configuration: ' + error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server ready on http://localhost:${PORT}`);
  console.log('📝 Available routes:');
  console.log('  GET  /');
  console.log('  POST /api/chat');
  console.log('  POST /api/update-env');
  console.log('  POST /api/save-config');
  console.log('  GET  /api/get-config');
});

