import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, Sparkles, Bot, Info, CheckCheck } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsTabProps {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onToggleRead: (id: string) => void;
}

export default function NotificationsTab({
  notifications,
  onMarkAllRead,
  onToggleRead,
}: NotificationsTabProps) {
  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'poetry':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'bot':
        return <Bot className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-teal-500" />;
    }
  };

  return (
    <div className="space-y-5 pb-28" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-neutral-850 dark:text-neutral-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-500" />
            خبرتیاوې (Notifications)
          </h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
            د اپلیکیشن او ادبي فیډ ټولې مهمې خبرتیاوې
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            ټول لوستل شوي
          </button>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onToggleRead(n.id)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex gap-3.5 items-start ${
                !n.read
                  ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30 dark:border-emerald-500/20 shadow-sm'
                  : 'bg-white dark:bg-neutral-850 border-neutral-200/80 dark:border-neutral-800 opacity-80'
              }`}
            >
              <div
                className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                  !n.read ? 'bg-emerald-500/15 dark:bg-emerald-500/20' : 'bg-neutral-100 dark:bg-neutral-800'
                }`}
              >
                {getIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-100 flex items-center gap-2">
                    {n.title}
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    )}
                  </h3>
                  <span className="text-[10px] text-neutral-400">{n.date}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {n.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
