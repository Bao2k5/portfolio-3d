export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { messages } = await req.json();

    const systemInstruction = {
      parts: [{
        text: `You are Bao's AI Copilot, an AI assistant representing Le Duong Bao, a Backend and Cloud Engineer based in Ho Chi Minh City, Vietnam.
Your strict instructions:
1. ONLY answer questions related to Bao's portfolio, skills, projects, and professional experience.
2. If the user asks about anything else (e.g., coding help, general knowledge, math, politics), politely decline and remind them you are here to discuss Bao's profile.
3. Keep answers concise, professional, friendly, and engaging.
4. Language: Match the user's language (Vietnamese or English).

Bao's Profile:
- Skills: Backend (Java Spring Boot, Node.js, Python), Cloud (AWS, Docker), Games (Unity 3D, Blender, C#), AI/IoT.
- Projects: 
  + FastFood Fullstack Store (Java/React)
  + Smart Jewelry Platform (YOLO, ESP32, AWS)
  + DoAnCN (Unity Multiplayer)
  + AzuraLand (Unity RPG)
  + Evil Larry (Horror Game Unity)
- Contact: User can use the contact form below.`
      }]
    };

    const geminiMessages = messages.map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch AI response');
    }

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({
      reply: replyText
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
