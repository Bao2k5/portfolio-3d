import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Plugin to simulate Vercel Serverless Function locally
const apiPlugin = () => ({
  name: 'api-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const env = loadEnv('', process.cwd(), '');
            const apiKey = env.GEMINI_API_KEY;
            
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: "Missing GEMINI_API_KEY in .env file" }));
              return;
            }

            const systemInstruction = {
              parts: [{
                text: `You are Bao's AI Copilot, an AI assistant representing Le Duong Bao, a Backend and Cloud Engineer based in Ho Chi Minh City, Vietnam.
Your strict instructions:
1. ONLY answer questions related to Bao's portfolio, skills, projects, and professional experience.
2. If the user asks about anything else, politely decline.
3. Keep answers concise, professional, and friendly.
4. Language: Match the user's language.`
              }]
            };

            const geminiMessages = data.messages.map(m => ({
              role: m.role === 'ai' ? 'model' : 'user',
              parts: [{ text: m.content }]
            }));

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                systemInstruction: systemInstruction,
                contents: geminiMessages,
                generationConfig: {
                  temperature: 0.5,
                  maxOutputTokens: 500,
                }
              })
            });
            
            const result = await response.json();
            res.setHeader('Content-Type', 'application/json');
            
            if (response.ok) {
              const replyText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
              res.end(JSON.stringify({ reply: replyText }));
            } else {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: result.error?.message || "Gemini Error" }));
            }
          } catch(e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin()],
});
