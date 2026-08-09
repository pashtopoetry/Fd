import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark, Share2, Copy, Heart, Check } from 'lucide-react';
import { TelegramMessage, SavedItem } from '../types';

interface TelegramMessageCardProps {
  key?: React.Key;
  message: TelegramMessage;
  onToggleBookmark?: (item: SavedItem) => void;
  isBookmarked?: boolean;
}

export default function TelegramMessageCard({ message, onToggleBookmark, isBookmarked = false }: TelegramMessageCardProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(message.likesCount || Math.floor(Math.random() * 15) + 3);

  const formatDate = (dateVal?: number) => {
    if (!dateVal) return '';
    const ts = dateVal > 1e11 ? dateVal : dateVal * 1000;
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '';
    try {
      return d.toLocaleString('ps-AF', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return d.toLocaleString();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: message.chatTitle,
        text: message.text,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const handleBookmarkClick = () => {
    if (onToggleBookmark) {
      onToggleBookmark({
        id: message.id,
        text: message.text,
        author: message.chatTitle,
        date: new Date(message.date * 1000).toLocaleDateString('ps-AF'),
        type: 'telegram',
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all space-y-3"
      dir="rtl"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {message.authorAvatar ? (
            <img
              src={message.authorAvatar}
              alt={message.chatTitle}
              className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 object-cover ring-2 ring-emerald-500/20"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              {message.chatTitle.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-850 dark:text-neutral-100 flex items-center gap-1.5">
              {message.chatTitle}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
              {formatDate(message.date)}
            </span>
          </div>
        </div>

        <button
          onClick={handleBookmarkClick}
          className={`p-2 rounded-xl transition-colors ${
            isBookmarked
              ? 'bg-amber-500/10 text-amber-500'
              : 'text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          title="خوندي کول"
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
        </button>
      </div>

      <p className="text-neutral-800 dark:text-neutral-100 text-base leading-[1.8] whitespace-pre-wrap font-medium pt-1">
        {message.text}
      </p>

      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
              liked
                ? 'bg-rose-500/10 text-rose-500 font-bold'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{likes}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
            title="کاپي"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-bold">کاپي شو!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>کاپي</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
            title="شریکول"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
