import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Trash2, Copy, Share2, Check, Sparkles, MessageCircle } from 'lucide-react';
import { SavedItem } from '../types';

interface BookmarksTabProps {
  bookmarks: SavedItem[];
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
}

export default function BookmarksTab({ bookmarks, onRemoveBookmark, onClearAll }: BookmarksTabProps) {
  const [filter, setFilter] = useState<'all' | 'telegram' | 'poetry'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = bookmarks.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5 pb-28" dir="rtl">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-neutral-850 dark:text-neutral-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
            خوندي شوي توکي ({bookmarks.length})
          </h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
            ستاسو انتخاب شوي او خوندور شعرونه او لیکنې
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-rose-500 hover:text-rose-600 font-bold px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
          >
            ټول پاکول
          </button>
        )}
      </div>

      {/* FILTER TABS */}
      {bookmarks.length > 0 && (
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'ټول' },
            { id: 'telegram', label: 'د تلګرام لیکنې' },
            { id: 'poetry', label: 'شعرونه' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f.id
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white dark:bg-neutral-850 text-neutral-500 dark:text-neutral-400 border border-neutral-200/80 dark:border-neutral-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* LIST */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-850 p-5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                <span className="flex items-center gap-1.5 font-bold text-neutral-700 dark:text-neutral-300">
                  {item.type === 'poetry' ? (
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                  {item.author}
                </span>
                <span>{item.date}</span>
              </div>

              <p className="text-neutral-850 dark:text-neutral-100 text-base leading-relaxed whitespace-pre-wrap font-serif">
                {item.text}
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <button
                  onClick={() => handleCopy(item.id, item.text)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-bold">کاپي شو</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>کاپي</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onRemoveBookmark(item.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                  title="لیست څخه لرې کول"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 px-4 bg-white dark:bg-neutral-850 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">
              هیڅ خوندي شوی توکی نشته
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-[240px] mx-auto">
              تاسې کولی شئ په کور پاڼه کې د هرې لیکنې یا شعر د نښاني کولو تڼۍ په کښېکاږلو هغه دلته خوندي کړئ.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
