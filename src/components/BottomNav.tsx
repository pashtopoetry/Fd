import React from 'react';
import { Home, Sparkles, Bookmark, Bell, User, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export type TabType = 'home' | 'poetry' | 'bookmarks' | 'notifications' | 'profile' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unreadNotificationsCount: number;
}

export default function BottomNav({ activeTab, setActiveTab, unreadNotificationsCount }: BottomNavProps) {
  const tabs: Array<{ id: TabType; label: string; icon: any; badge?: number }> = [
    { id: 'home', label: 'کور', icon: Home },
    { id: 'poetry', label: 'شعر او AI', icon: Sparkles },
    { id: 'bookmarks', label: 'خوندي', icon: Bookmark },
    { id: 'notifications', label: 'خبرتیاوې', icon: Bell, badge: unreadNotificationsCount },
    { id: 'profile', label: 'پروفایل', icon: User },
    { id: 'settings', label: 'ترتیبات', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1 pointer-events-none max-w-md mx-auto">
      <nav className="pointer-events-auto bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-2xl px-2 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 group"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-active:scale-90 ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 animate-pulse">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                ) : null}
              </div>

              <span
                className={`text-[10px] font-bold mt-1 transition-colors ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400 dark:text-neutral-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
