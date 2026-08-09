import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, RefreshCw, Plus, Bot, Send, Info } from 'lucide-react';
import { TelegramMessage, BotConfig } from './types';

export default function AdminPanel() {
  const [token, setToken] = useState('');
  const [bots, setBots] = useState<BotConfig[]>([]);
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  
  // Manual post state
  const [manualText, setManualText] = useState('');
  const [authorName, setAuthorName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadBots();
    loadMessages();
  }, []);

  const loadBots = () => {
    fetch('/api/telegram/bots')
      .then((res) => res.json())
      .then((data) => setBots(data.bots || []));
  };

  const loadMessages = () => {
    fetch('/api/telegram/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []));
  };

  const handleAddBot = async () => {
    if (!token.trim()) return;
    setLoading(true);
    setError('');
    setStatusMsg('');
    try {
      const res = await fetch('/api/telegram/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: token.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add bot');
      setToken('');
      loadBots();
      loadMessages();
      setStatusMsg(`بوټ @${data.bot.username} په بریا سره وصل شو!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBot = async (botId: string) => {
    if (!confirm('ایا غواړئ دا بوټ ړنګ کړئ؟ (Delete this bot?)')) return;
    setLoading(true);
    await fetch(`/api/telegram/bots/${encodeURIComponent(botId)}`, { method: 'DELETE' });
    loadBots();
    setLoading(false);
  };

  const handleSync = async () => {
    setLoading(true);
    setStatusMsg('د تلګرام څخه د نویو لیکنو راوړل...');
    try {
      const res = await fetch('/api/telegram/sync', { method: 'POST' });
      const data = await res.json();
      loadMessages();
      if (data.syncInfo) {
        setStatusMsg(`تازه شو! ${data.syncInfo.newCount || 0} نوې لیکنې ترلاسه شوې.`);
      } else {
        setStatusMsg('په بریا سره تازه شو.');
      }
    } catch {
      setStatusMsg('خطا رامنځته شوه.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManualPost = async () => {
    if (!manualText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/telegram/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: manualText.trim(),
          authorName: authorName.trim() || 'اډمین'
        })
      });
      if (res.ok) {
        setManualText('');
        loadMessages();
        setStatusMsg('نوې لیکنه په بریا سره شایع شوه!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('ایا غواړئ دا لیکنه ړنګه کړئ؟ (Delete this message?)')) return;
    await fetch(`/api/telegram/messages/${id}`, { method: 'DELETE' });
    loadMessages();
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-4 sm:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2.5 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180 text-neutral-700 dark:text-neutral-200" />
            </button>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
              د اډمین مدیریت (Admin Control Panel)
            </h1>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-2xl text-sm font-medium border border-emerald-200/60 dark:border-emerald-800/50">
            {statusMsg}
          </div>
        )}

        {/* HELPER BOX FOR TELEGRAM CHANNEL SETUP */}
        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">مهمه لارښوونه (Telegram Bot Setup):</p>
            <p>
              د دې لپاره چې له تلګرام چینل یا ګروپ څخه لیکنې سملاسي په اپلیکیشن کې راکښته شي، د خپل تلګرام بوټ ټوکن (Bot Token) دلته زیا کړئ او ورپسې هماغه بوټ په خپل تلګرام چینل کې د <strong>Admin</strong> په توګه ورزیات کړئ.
            </p>
          </div>
        </div>

        {/* BOTS SECTION */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-200/60 dark:border-neutral-700/60 space-y-6">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-emerald-500" />
            <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
              د بوټ ټوکن نښلول (Telegram Bot Tokens)
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="مثال: 123456789:ABCdefGhIJKlmNoPQrsTUVwxyZ..."
                className="w-full p-3.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-left font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                dir="ltr"
              />
              {error && <p className="text-red-500 text-xs px-2 pt-1">{error}</p>}
            </div>
            <button
              onClick={handleAddBot}
              disabled={loading || !token.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              بوټ وصل کړئ
            </button>
          </div>

          <div className="space-y-3">
            {bots.length === 0 ? (
              <p className="text-neutral-400 text-sm py-2">تر اوسه هیڅ بوټ نه دی وصل شوی.</p>
            ) : (
              bots.map((bot) => (
                <div key={bot.id} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      {bot.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-neutral-800 dark:text-neutral-100 text-sm">{bot.name}</div>
                      <div className="text-xs text-neutral-400 font-mono" dir="ltr">@{bot.username} ({bot.token})</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBot(bot.id)}
                    disabled={loading}
                    className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                    title="ړنګول"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MANUAL POST PUBLISH SECTION */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-200/60 dark:border-neutral-700/60 space-y-4">
          <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-500" />
            په مستقیم ډول لیکنه شایع کول (Manual Post)
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="لیکوال / سرلیک (د مثال په توګه: پښتو ادب، عبدالرحمان بابا)"
              className="w-full p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              rows={3}
              placeholder="د لیکنې یا شعر متین دلته ولیکئ..."
              className="w-full p-3.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
            <button
              onClick={handleCreateManualPost}
              disabled={loading || !manualText.trim()}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              لیکنه ثبت او فیډ ته پورته کړئ
            </button>
          </div>
        </div>

        {/* MESSAGES MANAGEMENT SECTION */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-200/60 dark:border-neutral-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
              ټولې پرتلې شوې لیکنې ({messages.length})
            </h2>
            <button
              onClick={handleSync}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold transition-colors disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              نوې لیکنې تازه کول (Sync)
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <p className="text-neutral-400 text-center py-6 text-sm">هیڅ لیکنه فیډ ته نه ده راغلې</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 items-start">
                  <div className="flex-1 space-y-1">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {msg.chatTitle}
                    </div>
                    <div className="text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                    title="ړنګول"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
