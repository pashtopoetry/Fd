import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, RefreshCw, Feather, BookOpen, Quote, Smartphone, Filter } from 'lucide-react';
import { TelegramMessage, SavedItem } from '../types';
import TelegramMessageCard from './TelegramMessageCard';

interface HomeDashboardProps {
  onNavigateToPoetry: () => void;
  bookmarks: SavedItem[];
  onToggleBookmark: (item: SavedItem) => void;
}

const DAILY_LANDAY = [
  { text: 'له غرونو واورې روانې شوې\nزما به کله له جانان سره لیدل شینه', author: 'د ورځې لنډۍ' },
  { text: 'که په میوند کې شهید نه شوې\nخداېګو لالیه بې ننګۍ ته دې ساتینه', author: 'ملالۍ میوندۍ' },
  { text: 'رحمانه خپله ژبه پټه وساته\nکه غواړې چې په جهان کې معتبر شې', author: 'رحمان بابا' },
];

export default function HomeDashboard({
  onNavigateToPoetry,
  bookmarks,
  onToggleBookmark,
}: HomeDashboardProps) {
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dailyIndex, setDailyIndex] = useState(0);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = () => {
    fetch('/api/telegram/messages')
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const categories = [
    { id: 'all', label: 'ټولې لیکنې' },
    { id: 'poetry', label: 'شعرونه او غزلې' },
    { id: 'landay', label: 'لنډۍ او متلونه' },
    { id: 'articles', label: 'ادبي مقالې' },
  ];

  const bookmarkedIds = new Set(bookmarks.map((b) => b.id));

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.chatTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'poetry') return msg.text.includes('شعر') || msg.text.includes('غزل') || msg.text.includes('نظم');
    if (selectedCategory === 'landay') return msg.text.includes('لنډۍ') || msg.text.includes('متل');
    if (selectedCategory === 'articles') return !msg.text.includes('شعر') && !msg.text.includes('لنډۍ');

    return true;
  });

  return (
    <div className="space-y-5 pb-28" dir="rtl">
      {/* HERO BANNER - DAILY LANDAY / QUOTE */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/15"
      >
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wide">
              <Quote className="w-3.5 h-3.5" />
              د ورځې بیت
            </span>
            <button
              onClick={() => setDailyIndex((prev) => (prev + 1) % DAILY_LANDAY.length)}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-xs flex items-center gap-1"
              title="بل بیت"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-lg font-bold leading-relaxed whitespace-pre-wrap font-serif pt-1">
            "{DAILY_LANDAY[dailyIndex].text}"
          </p>

          <p className="text-xs text-emerald-100 font-medium">
            — {DAILY_LANDAY[dailyIndex].author}
          </p>
        </div>
      </motion.div>

      {/* AI GENERATOR SHORTCUT BANNER */}
      <div
        onClick={onNavigateToPoetry}
        className="cursor-pointer bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 dark:border-amber-500/20 rounded-3xl p-4 flex items-center justify-between hover:border-amber-500/50 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-100">
              د AI په واسطه نوی شعر جوړ کړئ
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              د خپلې خوښې په هره موضوع سمدستي په جادويي توګه شعرونه جوړ کړئ
            </p>
          </div>
        </div>
        <Feather className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform rtl:-scale-x-100" />
      </div>

      {/* SEARCH BAR & CATEGORIES */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="د لیکوال نوم یا پېغام برخه وپټوئ..."
            className="w-full pr-11 pl-4 py-3.5 bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl text-sm text-neutral-850 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-lg"
            >
              پاکول
            </button>
          )}
        </div>

        {/* CATEGORY CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-neutral-850 text-neutral-600 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* FEED HEADER & REFRESH */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-base font-extrabold text-neutral-850 dark:text-neutral-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          وروستۍ ادبي لیکنې
        </h2>
        <button
          onClick={fetchMessages}
          className="p-2 text-xs font-bold text-neutral-500 hover:text-emerald-500 flex items-center gap-1 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          تازه کول
        </button>
      </div>

      {/* FEED CONTENT */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-neutral-850 rounded-3xl p-5 border border-neutral-200/60 dark:border-neutral-800 animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                  <div className="h-2 bg-neutral-100 dark:bg-neutral-850 rounded w-1/4" />
                </div>
              </div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((item) => (
              <TelegramMessageCard
                key={item.id}
                message={item}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={bookmarkedIds.has(item.id)}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3 bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm"
            >
              <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">
                هیڅ لیکنه ونه موندل شوه
              </h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed max-w-[260px]">
                {searchQuery
                  ? 'ستاسو له پلټنې سره برابره کومه لیکنه پیدا نه شوه.'
                  : 'تلګرام کې د نوې لیکنې له شایع کیدو سره سم به دلته څرګنده شي.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
