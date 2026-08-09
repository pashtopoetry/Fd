import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { TelegramMessage } from './types';
import TelegramMessageCard from './components/TelegramMessageCard';
import AdminPanel from './AdminPanel';
import { Moon, Sun, Wifi, Battery, Signal, Smartphone, MessageCircle, Feather, Loader2, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function TelegramFeed() {
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/telegram/messages')
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
      
    const pollInterval = setInterval(() => {
      fetch('/api/telegram/messages')
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.messages || []);
        });
    }, 10000);
    return () => clearInterval(pollInterval);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-100/50 dark:bg-neutral-900/40 p-5 space-y-4 pb-24">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {messages.length > 0 ? (
            messages.map((item) => (
              <TelegramMessageCard key={item.id} message={item} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 bg-white dark:bg-neutral-800/40 rounded-3xl border border-neutral-200/50 dark:border-neutral-850"
            >
              <div className="p-4 bg-neutral-50 dark:bg-neutral-850 rounded-full text-neutral-300 dark:text-neutral-600">
                <Smartphone className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">
                  هیڅ لیکنه نشته
                </h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed max-w-[260px] mx-auto">
                  تر اوسه له تلګرام څخه هیڅ لیکنه نه ده ترلاسه شوې. مهرباني وکړئ خپل چینل کې یوه لیکنه وکړئ.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function PoetryGenerator() {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('Ghazal');
  const [poetry, setPoetry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const types = ['Ghazal', 'Landay', 'Nazam', 'Rubai'];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setPoetry('');
    
    try {
      const res = await fetch('/api/poetry/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      setPoetry(data.poetry);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-100/50 dark:bg-neutral-900/40 p-5 space-y-5 pb-24" dir="rtl">
      <div className="bg-white dark:bg-neutral-800 p-5 rounded-3xl shadow-sm border border-neutral-200/60 dark:border-neutral-700/60 space-y-4">
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">د شعر جوړول (Generate Poetry)</h2>
        
        <div className="space-y-2">
          <label className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">موضوع (Topic)</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="د مثال په توګه: مینه، وطن، سوله..."
            className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">ډول (Type)</label>
          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  type === t 
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 mt-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Feather className="w-5 h-5" />}
          جوړ کړئ (Generate)
        </button>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}
      </div>

      {poetry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-200/60 dark:border-neutral-700/60"
        >
          <h3 className="text-sm font-medium text-neutral-500 mb-4 flex items-center gap-2">
            <Feather className="w-4 h-4 text-emerald-500" />
            پایله (Result)
          </h3>
          <p className="text-neutral-800 dark:text-neutral-100 text-[16px] leading-[2.2] whitespace-pre-wrap font-medium text-center">
            {poetry}
          </p>
        </motion.div>
      )}
    </div>
  );
}

function MobileApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'feed' | 'poetry'>('feed');

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pashto_list_dark_mode');
    return saved === 'true';
  });

  const [timeStr, setTimeStr] = useState('12:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('pashto_list_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-neutral-200 dark:bg-neutral-950 flex flex-col items-center justify-center p-0 sm:p-8 transition-colors duration-300`}>
      {/* Hardware phone frame wrapper */}
      <div className="relative w-full h-screen sm:h-[844px] sm:w-[390px] sm:max-w-none">
        
        {/* Hardware buttons (desktop only) */}
        {/* Volume Up */}
        <div className="hidden sm:block absolute -left-[14px] top-32 w-1.5 h-14 bg-neutral-700 dark:bg-neutral-800 rounded-l-md shadow-inner" />
        {/* Volume Down */}
        <div className="hidden sm:block absolute -left-[14px] top-52 w-1.5 h-14 bg-neutral-700 dark:bg-neutral-800 rounded-l-md shadow-inner" />
        {/* Power Button */}
        <div className="hidden sm:block absolute -right-[14px] top-40 w-1.5 h-20 bg-neutral-700 dark:bg-neutral-800 rounded-r-md shadow-inner" />
        
        {/* Phone screen container */}
        <div className="w-full h-full bg-white dark:bg-neutral-900 sm:rounded-[48px] sm:shadow-[0_0_0_12px_#262626,0_20px_40px_-10px_rgba(0,0,0,0.5)] dark:sm:shadow-[0_0_0_12px_#171717,0_20px_40px_-10px_rgba(0,0,0,0.8)] sm:ring-1 sm:ring-black/10 flex flex-col overflow-hidden relative transition-colors duration-300 z-10">
          
          {/* Android Punch Hole Camera (desktop only) */}
          <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-black rounded-full z-40 items-center justify-center shadow-[inset_0_-2px_4px_rgba(255,255,255,0.1)]">
             {/* Camera lens reflection */}
             <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40 border border-white/10" />
          </div>

          {/* 1. Android Status Bar */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800/60 px-5 pt-3 sm:pt-4 pb-2.5 flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400 select-none z-30">
            <span className="font-mono tracking-tight">{timeStr}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono font-medium">92%</span>
                <Battery className="w-4 h-4 rotate-90 scale-90" />
              </div>
            </div>
          </div>

          {/* 2. Top App Bar */}
          <header className="bg-white dark:bg-neutral-900 px-5 pt-4 pb-0 border-b border-neutral-100 dark:border-neutral-800/80 flex flex-col gap-3 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 tracking-tight leading-tight">
                  پښتو ادب
                </h1>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
                  title={darkMode ? 'ورځ حالت (Light Mode)' : 'شپه حالت (Dark Mode)'}
                >
                  {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
                  title="اډمین پینل (Admin Panel)"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-4 px-1">
              <button
                onClick={() => setActiveTab('feed')}
                className={`py-2.5 border-b-2 text-[13px] font-bold transition-colors ${
                  activeTab === 'feed' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                }`}
              >
                تلګرام لیکنې
              </button>
              <button
                onClick={() => setActiveTab('poetry')}
                className={`py-2.5 border-b-2 text-[13px] font-bold transition-colors ${
                  activeTab === 'poetry' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                }`}
              >
                شعرونه جوړول
              </button>
            </div>
          </header>

          {/* Main Tab Content */}
          {activeTab === 'feed' ? <TelegramFeed /> : <PoetryGenerator />}

          {/* Android Navigation Bar */}
          <div className="absolute bottom-0 w-full py-1.5 flex justify-center select-none z-40 pointer-events-none">
            <div className="w-32 h-1 bg-neutral-300/80 dark:bg-neutral-700/80 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MobileApp />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}

