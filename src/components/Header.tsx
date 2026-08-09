import React from 'react';
import { Moon, Sun, Bell, Sparkles, User, Settings as SettingsIcon } from 'lucide-react';
import { UserProfile } from '../types';
import { TabType } from './BottomNav';

interface HeaderProps {
  user: UserProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  unreadCount: number;
  setActiveTab: (tab: TabType) => void;
  activeTab: TabType;
}

export default function Header({
  user,
  darkMode,
  setDarkMode,
  unreadCount,
  setActiveTab,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/60 dark:border-neutral-800/60 px-4 py-3" dir="rtl">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: User Profile Avatar & Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('profile')}
            className="relative group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            </div>
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-neutral-850 dark:text-neutral-100 tracking-tight">
                پښتو ادب
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md">
                پریمیم
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              سلام، {user.name} 👋
            </p>
          </div>
        </div>

        {/* Right: Actions (Theme, Notifications, Settings) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title="تمه بدلول"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title="خبرتیاوې"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-neutral-900 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title="ترتیبات"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
