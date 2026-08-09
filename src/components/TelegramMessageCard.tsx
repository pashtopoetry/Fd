import React from 'react';
import { motion } from 'motion/react';
import { TelegramMessage } from '../types';

export default function TelegramMessageCard({ message }: { message: TelegramMessage; key?: any }) {
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

  const dateStr = formatDate(message.date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        {message.authorAvatar ? (
          <img src={message.authorAvatar} alt={message.chatTitle} className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
            {message.chatTitle.charAt(0)}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
            {message.chatTitle}
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {dateStr}
          </span>
        </div>
      </div>
      <p
        className="text-neutral-800 dark:text-neutral-100 text-[15px] leading-[1.8] whitespace-pre-wrap"
        dir="auto"
      >
        {message.text}
      </p>
    </motion.div>
  );
}
