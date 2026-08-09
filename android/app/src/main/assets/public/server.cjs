var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var DATA_FILE = import_path.default.join(process.cwd(), "data.json");
var appData = {
  bots: [],
  messages: []
};
if (import_fs.default.existsSync(DATA_FILE)) {
  try {
    const raw = import_fs.default.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    appData.messages = parsed.messages || [];
    if (parsed.bots) {
      appData.bots = parsed.bots.map((b, idx) => ({
        id: b.id || b.username || `bot_${idx}_${Date.now()}`,
        token: b.token || "",
        name: b.name || "Bot",
        username: b.username || "bot",
        lastUpdateId: b.lastUpdateId || 0
      }));
    } else if (parsed.botToken) {
      appData.bots = [{
        id: "bot_main",
        token: parsed.botToken,
        name: "Main Bot",
        username: "bot",
        lastUpdateId: parsed.lastUpdateId || 0
      }];
    }
  } catch (e) {
    console.error("Failed to parse data.json", e);
  }
}
var saveData = () => {
  import_fs.default.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2));
};
app.get("/api/telegram/messages", (req, res) => {
  res.json({ messages: appData.messages });
});
app.get("/api/telegram/bots", (req, res) => {
  res.json({
    bots: appData.bots.map((b) => ({
      id: b.id,
      name: b.name,
      username: b.username,
      token: b.token ? b.token.substring(0, 10) + "..." : ""
    }))
  });
});
app.post("/api/telegram/bots", async (req, res) => {
  const { botToken } = req.body;
  if (!botToken) return res.status(400).json({ error: "Token is required" });
  const cleanToken = botToken.trim();
  if (appData.bots.find((b) => b.token === cleanToken)) {
    return res.status(400).json({ error: "Bot already exists" });
  }
  try {
    try {
      await fetch(`https://api.telegram.org/bot${cleanToken}/deleteWebhook?drop_pending_updates=false`);
    } catch (e) {
      console.warn("Webhook delete attempt failed:", e);
    }
    const verifyRes = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`);
    const verifyData = await verifyRes.json();
    if (!verifyData.ok) {
      return res.status(400).json({ error: verifyData.description || "Invalid Telegram bot token" });
    }
    const botId = String(verifyData.result.id || Date.now());
    const newBot = {
      id: botId,
      token: cleanToken,
      name: verifyData.result.first_name || "Unknown Bot",
      username: verifyData.result.username || "unknown",
      lastUpdateId: 0
    };
    appData.bots.push(newBot);
    saveData();
    setTimeout(() => {
      fetchTelegramUpdates();
    }, 500);
    res.json({ success: true, bot: { id: newBot.id, name: newBot.name, username: newBot.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/telegram/bots/:id", (req, res) => {
  const { id } = req.params;
  appData.bots = appData.bots.filter((b) => b.id !== id && !b.token.startsWith(id));
  saveData();
  res.json({ success: true });
});
app.post("/api/telegram/messages", (req, res) => {
  const { text, authorName } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Message text is required" });
  }
  const title = authorName?.trim() || "\u067E\u069A\u062A\u0648 \u0627\u062F\u0628";
  const newMsg = {
    id: `manual_${Date.now()}`,
    text: text.trim(),
    date: Math.floor(Date.now() / 1e3),
    chatTitle: title,
    source: "admin",
    authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=10b981&color=fff&size=128`
  };
  appData.messages.unshift(newMsg);
  saveData();
  res.json({ success: true, message: newMsg });
});
app.delete("/api/telegram/messages/:id", (req, res) => {
  const { id } = req.params;
  appData.messages = appData.messages.filter((m) => m.id !== id);
  saveData();
  res.json({ success: true });
});
app.post("/api/telegram/sync", async (req, res) => {
  const result = await fetchTelegramUpdates();
  res.json({ success: true, messages: appData.messages, syncInfo: result });
});
var ai = new import_genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.post("/api/poetry/generate", async (req, res) => {
  try {
    const { topic, type } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }
    const prompt = `You are a master Pashto poet. Create a high-quality Pashto poetry.
Type: ${type} (e.g. Ghazal, Landay, Nazam, Rubai).
Topic: ${topic}.
Provide ONLY the Pashto poetry text. Do not add explanations or translations. Use classic poetic structure.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    res.json({ poetry: response.text });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: error.message || "Failed to generate poetry." });
  }
});
var isFetching = false;
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
            const msg = update.channel_post || update.message || update.edited_channel_post || update.edited_message;
            if (msg) {
              const text = msg.text || msg.caption || "";
              if (text && text.trim()) {
                const uniqueMsgId = `tg_${bot.id}_${msg.chat?.id || "chat"}_${msg.message_id}`;
                const existing = appData.messages.find(
                  (m) => m.id === uniqueMsgId || m.botToken === bot.token && m.id === String(msg.message_id)
                );
                if (!existing) {
                  const chatTitle = msg.chat?.title || msg.chat?.first_name || msg.from?.first_name || bot.name || "\u062A\u0644\u06AB\u0631\u0627\u0645";
                  appData.messages.unshift({
                    id: uniqueMsgId,
                    botToken: bot.token,
                    text: text.trim(),
                    date: msg.date || Math.floor(Date.now() / 1e3),
                    chatTitle,
                    source: update.channel_post ? "channel" : "bot",
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
setInterval(fetchTelegramUpdates, 15e3);
setTimeout(fetchTelegramUpdates, 2e3);
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
