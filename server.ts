import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory/file storage for preview purposes
const DATA_FILE = path.join(process.cwd(), 'data.json');

interface BotConfig {
  id: string;
  token: string;
  name: string;
  username: string;
  lastUpdateId: number;
}

interface AppData {
  bots: BotConfig[];
  messages: any[];
}

let appData: AppData = {
  bots: [],
  messages: [],
};

// Load data if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Migration from old schema
    appData.messages = parsed.messages || [];
    if (parsed.bots) {
      appData.bots = parsed.bots.map((b: any, idx: number) => ({
        id: b.id || b.username || `bot_${idx}_${Date.now()}`,
        token: b.token || '',
        name: b.name || 'Bot',
        username: b.username || 'bot',
        lastUpdateId: b.lastUpdateId || 0,
      }));
    } else if (parsed.botToken) {
      appData.bots = [{
        id: 'bot_main',
        token: parsed.botToken,
        name: 'Main Bot',
        username: 'bot',
        lastUpdateId: parsed.lastUpdateId || 0
      }];
    }
  } catch (e) {
    console.error('Failed to parse data.json', e);
  }
}

const saveData = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2));
};

// --- API ROUTES ---

app.get('/api/telegram/messages', (req, res) => {
  res.json({ messages: appData.messages });
});

app.get('/api/telegram/bots', (req, res) => {
  // Hide tokens for security on the frontend, although this is admin
  res.json({
    bots: appData.bots.map(b => ({
      id: b.id,
      name: b.name,
      username: b.username,
      token: b.token ? b.token.substring(0, 10) + '...' : ''
    }))
  });
});

// Add a new bot token
app.post('/api/telegram/bots', async (req, res) => {
  const { botToken } = req.body;
  if (!botToken) return res.status(400).json({ error: 'Token is required' });

  const cleanToken = botToken.trim();

  if (appData.bots.find(b => b.token === cleanToken)) {
    return res.status(400).json({ error: 'Bot already exists' });
  }

  try {
    // Delete any active webhook first so getUpdates can work without 409 Conflict
    try {
      await fetch(`https://api.telegram.org/bot${cleanToken}/deleteWebhook?drop_pending_updates=false`);
    } catch (e) {
      console.warn('Webhook delete attempt failed:', e);
    }

    // Verify token with Telegram
    const verifyRes = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`);
    const verifyData = await verifyRes.json();

    if (!verifyData.ok) {
      return res.status(400).json({ error: verifyData.description || 'Invalid Telegram bot token' });
    }

    const botId = String(verifyData.result.id || Date.now());
    const newBot: BotConfig = {
      id: botId,
      token: cleanToken,
      name: verifyData.result.first_name || 'Unknown Bot',
      username: verifyData.result.username || 'unknown',
      lastUpdateId: 0
    };

    appData.bots.push(newBot);
    saveData();
    
    // Trigger an immediate fetch for this new bot
    setTimeout(() => {
      fetchTelegramUpdates();
    }, 500);

    res.json({ success: true, bot: { id: newBot.id, name: newBot.name, username: newBot.username } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a bot
app.delete('/api/telegram/bots/:id', (req, res) => {
  const { id } = req.params;
  appData.bots = appData.bots.filter(b => b.id !== id && !b.token.startsWith(id));
  saveData();
  res.json({ success: true });
});

// Add a manual message (Admin feature)
app.post('/api/telegram/messages', (req, res) => {
  const { text, authorName } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const title = authorName?.trim() || 'پښتو ادب';
  const newMsg = {
    id: `manual_${Date.now()}`,
    text: text.trim(),
    date: Math.floor(Date.now() / 1000),
    chatTitle: title,
    source: 'admin',
    authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=10b981&color=fff&size=128`
  };

  appData.messages.unshift(newMsg);
  saveData();

  res.json({ success: true, message: newMsg });
});

// Delete a message (Admin feature)
app.delete('/api/telegram/messages/:id', (req, res) => {
  const { id } = req.params;
  appData.messages = appData.messages.filter((m) => m.id !== id);
  saveData();
  res.json({ success: true });
});

// Sync manual route (Admin feature)
app.post('/api/telegram/sync', async (req, res) => {
  const result = await fetchTelegramUpdates();
  res.json({ success: true, messages: appData.messages, syncInfo: result });
});

// --- GEMINI POETRY GENERATION ---
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/poetry/generate', async (req, res) => {
  try {
    const { topic, type } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const prompt = `You are a master Pashto poet. Create a high-quality Pashto poetry.
Type: ${type} (e.g. Ghazal, Landay, Nazam, Rubai).
Topic: ${topic}.
Provide ONLY the Pashto poetry text. Do not add explanations or translations. Use classic poetic structure.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.json({ poetry: response.text });
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate poetry.' });
  }
});

// --- TELEGRAM POLLING ---

let isFetching = false;

async function fetchTelegramUpdates() {
  if (isFetching || appData.bots.length === 0) return { fetched: 0, botsCount: appData.bots.length };
  isFetching = true;
  let hasNewMessages = false;
  let newCount = 0;

  try {
    for (const bot of appData.bots) {
      if (!bot.token) continue;
      
      try {
        const offset = bot.lastUpdateId > 0 ? bot.lastUpdateId + 1 : 0;
        const url = `https://api.telegram.org/bot${bot.token}/getUpdates?offset=${offset}&timeout=5`;
        const response = await fetch(url);
        const data = await response.json();

        // If conflict error (webhook active), delete webhook automatically and retry
        if (!data.ok && data.error_code === 409) {
          console.warn(`Webhook conflict for bot ${bot.name}, clearing webhook...`);
          await fetch(`https://api.telegram.org/bot${bot.token}/deleteWebhook?drop_pending_updates=false`);
          continue;
        }

        if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
          for (const update of data.result) {
            if (update.update_id) {
              bot.lastUpdateId = Math.max(bot.lastUpdateId || 0, update.update_id);
            }

            // Support channel_post, message, edited_channel_post, edited_message
            const msg = update.channel_post || update.message || update.edited_channel_post || update.edited_message;

            if (msg) {
              const text = msg.text || msg.caption || '';
              if (text && text.trim()) {
                const uniqueMsgId = `tg_${bot.id}_${msg.chat?.id || 'chat'}_${msg.message_id}`;
                
                // Check if already present by unique ID or matching content timestamp
                const existing = appData.messages.find(m => 
                  m.id === uniqueMsgId || 
                  (m.botToken === bot.token && m.id === String(msg.message_id))
                );

                if (!existing) {
                  const chatTitle = msg.chat?.title || msg.chat?.first_name || msg.from?.first_name || bot.name || 'تلګرام';
                  appData.messages.unshift({
                    id: uniqueMsgId,
                    botToken: bot.token,
                    text: text.trim(),
                    date: msg.date || Math.floor(Date.now() / 1000),
                    chatTitle: chatTitle,
                    source: update.channel_post ? 'channel' : 'bot',
                    authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(chatTitle)}&background=10b981&color=fff&size=128`
                  });
                  hasNewMessages = true;
                  newCount++;
                }
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error fetching Telegram updates for bot ${bot.name}:`, err);
      }
    }

    if (hasNewMessages) {
      saveData();
    }
  } finally {
    isFetching = false;
  }

  return { newCount, botsCount: appData.bots.length };
}

// Poll every 15 seconds
setInterval(fetchTelegramUpdates, 15000);

// Run once on startup
setTimeout(fetchTelegramUpdates, 2000);

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
