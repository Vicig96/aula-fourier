import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages format' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: messages,
        config: {
          systemInstruction: "Eres el asistente virtual de 'Aula Fourier', la página web personal del profesor Antonio Viciana Gálvez. Respondes de forma clara, breve, didáctica y cercana. Te especializas en Matemáticas, Física, Química, tecnología e ingeniería. Explicas paso a paso cuando se te pide ayuda con ejercicios. Si una pregunta se sale del ámbito docente STEM, rediriges con cortesía. No inventas datos."
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error('Error in /api/chat:', error);
      res.status(500).json({ error: 'Error processing chat request' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
