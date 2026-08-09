import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Feather, Loader2, Copy, Bookmark, Share2, Check, RefreshCw } from 'lucide-react';
import { SavedItem } from '../types';

interface PoetrySectionProps {
  onToggleBookmark: (item: SavedItem) => void;
  bookmarks: SavedItem[];
}

export default function PoetrySection({ onToggleBookmark, bookmarks }: PoetrySectionProps) {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('غزل');
  const [poetry, setPoetry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const types = ['غزل', 'لنډۍ', 'نظم', 'رباعي'];
  const topicPresets = ['مینه او جانان', 'افغانستان او وطن', 'سوله او هیله', 'جلاوالی او درد', 'طبیعت او بهار'];

  const bookmarkedIds = new Set(bookmarks.map((b) => b.id));
  const currentPoemId = `poetry_${topic}_${type}_${poetry.slice(0, 15)}`;
  const isBookmarked = bookmarkedIds.has(currentPoemId);

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
      if (!res.ok) throw new Error(data.error || 'د شعر پر جوړولو کې ستونزه رامنځته شوه');
      setPoetry(data.poetry);
    } catch (err: any) {
      setError(err.message || 'شبکوي شبکه کې ستونزه ده');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(poetry);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePoem = () => {
    if (!poetry) return;
    onToggleBookmark({
      id: currentPoemId,
      text: poetry,
      author: `AI جوړ شوی (${type}) - ${topic}`,
      date: new Date().toLocaleDateString('ps-AF'),
      type: 'poetry',
    });
  };

  return (
    <div className="space-y-6 pb-28" dir="rtl">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/10 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h2 className="text-lg font-extrabold">د AI ذکاوت په مرسته د پښتو شعر جوړول</h2>
        </div>
        <p className="text-xs text-emerald-100 leading-relaxed">
          د خپل زړه خبره او موضوع ولیکئ، خپله خوښه طایفه یا ډول وټاکئ او شعر په سمدستي توګه ترلاسه کړئ.
        </p>
      </div>

      {/* GENERATOR CARD */}
      <div className="bg-white dark:bg-neutral-850 p-6 rounded-3xl shadow-sm border border-neutral-200/80 dark:border-neutral-800 space-y-5">
        {/* TOPIC INPUT */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
            <span>موضوع (Topic)</span>
            <span className="text-[10px] text-neutral-400 font-normal">د مثال په توګه: د وطن مینه</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="د شعر موضوع ولیکئ..."
            className="w-full px-4 py-3.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl text-sm text-neutral-850 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />

          {/* PRESETS */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {topicPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => setTopic(preset)}
                className="px-2.5 py-1 text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* POETRY TYPE */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">د شعر ډول (Type)</label>
          <div className="grid grid-cols-4 gap-2">
            {types.map((t) => {
              const isSelected = type === t;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all text-center ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-102'
                      : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-800'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* GENERATE BUTTON */}
        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>د شعر پر پیوند کار روان دی...</span>
            </>
          ) : (
            <>
              <Feather className="w-5 h-5" />
              <span>شعر جوړ کړه</span>
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-medium border border-rose-200/60 dark:border-rose-900/50">
            {error}
          </div>
        )}
      </div>

      {/* GENERATED POETRY DISPLAY */}
      <AnimatePresence>
        {poetry && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-850 p-6 rounded-3xl shadow-sm border border-neutral-200/80 dark:border-neutral-800 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                {type} - {topic}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleSavePoem}
                  className={`p-2 rounded-xl transition-colors ${
                    isBookmarked
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  title="خوندي کول"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                </button>

                <button
                  onClick={handleCopy}
                  className="p-2 text-neutral-400 hover:text-emerald-500 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="کاپي"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-neutral-850 dark:text-neutral-100 text-lg leading-[2.2] font-serif text-center whitespace-pre-wrap py-2">
              {poetry}
            </p>

            <div className="text-center text-[11px] text-neutral-400 dark:text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              د پښتو ادب ځانګړي AI ذکاوت تولید کړی دی
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
