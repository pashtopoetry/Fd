import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Wifi, Battery, Signal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import Header from './components/Header';
import BottomNav, { TabType } from './components/BottomNav';
import HomeDashboard from './components/HomeDashboard';
import PoetrySection from './components/PoetrySection';
import BookmarksTab from './components/BookmarksTab';
import NotificationsTab from './components/NotificationsTab';
import ProfileTab from './components/ProfileTab';
import SettingsTab from './components/SettingsTab';
import AdminPanel from './AdminPanel';

import { UserProfile, SavedItem, AppNotification } from './types';

function MobileApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('pashto_adab_dark_mode') === 'true';
  });

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pashto_adab_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      name: 'پښتو مینه وال',
      username: 'pashto_reader',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'د پښتو بډای ادب او خوږو شعرونو مینه وال',
      joinDate: '۲۰۲۶',
    };
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<SavedItem[]>(() => {
    const saved = localStorage.getItem('pashto_adab_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'init_1',
        text: 'د ازادۍ سنګر ته پاڅه افغانه\nد خپل تاریخ زړه سواندې جګړې یادې کړه',
        author: 'پښتو ادب - لنډۍ',
        date: '۲۰۲۶/۸/۹',
        type: 'poetry',
      },
    ];
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('pashto_adab_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'n1',
        title: 'اپلیکیشن نوی شو!',
        message: 'د پښتو ادب پریمیم نسخه ۲.۴ پرانیستل شوه. همدا اوس له AI شعر او د بوټونو لېږد څخه خوند واخلئ.',
        date: 'همدا اوس',
        read: false,
        type: 'update',
      },
      {
        id: 'n2',
        title: 'د AI شعر جوړونکی فعال شو',
        message: 'ستاسو په خوښه د بهار، وطن او مینې شعرونه او غزلې سمدستي تولید کړئ.',
        date: 'نن',
        read: false,
        type: 'poetry',
      },
    ];
  });

  // Clock
  const [timeStr, setTimeStr] = useState('12:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('pashto_adab_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('pashto_adab_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pashto_adab_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('pashto_adab_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handlers
  const handleToggleBookmark = (item: SavedItem) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      if (exists) {
        return prev.filter((b) => b.id !== item.id);
      } else {
        return [item, ...prev];
      }
    });
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleClearBookmarks = () => {
    setBookmarks([]);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-neutral-200 dark:bg-neutral-950 flex flex-col items-center justify-center p-0 sm:p-6 transition-colors duration-300">
      {/* PHONE HARDWARE FRAME (DESKTOP / PREVIEW WRAPPER) */}
      <div className="relative w-full h-screen sm:h-[850px] sm:w-[410px] sm:max-w-none">
        {/* Hardware side buttons on desktop */}
        <div className="hidden sm:block absolute -left-[14px] top-32 w-1.5 h-14 bg-neutral-700 dark:bg-neutral-800 rounded-l-md shadow-inner" />
        <div className="hidden sm:block absolute -left-[14px] top-50 w-1.5 h-14 bg-neutral-700 dark:bg-neutral-800 rounded-l-md shadow-inner" />
        <div className="hidden sm:block absolute -right-[14px] top-40 w-1.5 h-20 bg-neutral-700 dark:bg-neutral-800 rounded-r-md shadow-inner" />

        {/* INNER SCREEN */}
        <div className="w-full h-full bg-neutral-50 dark:bg-neutral-900 sm:rounded-[48px] sm:shadow-[0_0_0_12px_#262626,0_25px_50px_-12px_rgba(0,0,0,0.5)] dark:sm:shadow-[0_0_0_12px_#171717,0_25px_50px_-12px_rgba(0,0,0,0.8)] sm:ring-1 sm:ring-black/10 flex flex-col overflow-hidden relative transition-colors duration-300">
          
          {/* CAMERA PUNCH HOLE */}
          <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 items-center justify-center shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50 border border-white/10" />
          </div>

          {/* STATUS BAR */}
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-5 pt-3 sm:pt-4 pb-2 flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400 select-none z-40" dir="ltr">
            <span className="font-mono text-[11px] font-bold">{timeStr}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono font-bold">98%</span>
                <Battery className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>
          </div>

          {/* APP HEADER */}
          <Header
            user={user}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            unreadCount={unreadNotificationsCount}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />

          {/* TAB SCROLLABLE BODY */}
          <main className="flex-1 overflow-y-auto px-4 pt-4 scrollbar-none relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === 'home' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === 'home' ? 10 : -10 }}
                transition={{ duration: 0.18 }}
                className="min-h-full"
              >
                {activeTab === 'home' && (
                  <HomeDashboard
                    onNavigateToPoetry={() => setActiveTab('poetry')}
                    bookmarks={bookmarks}
                    onToggleBookmark={handleToggleBookmark}
                  />
                )}

                {activeTab === 'poetry' && (
                  <PoetrySection
                    onToggleBookmark={handleToggleBookmark}
                    bookmarks={bookmarks}
                  />
                )}

                {activeTab === 'bookmarks' && (
                  <BookmarksTab
                    bookmarks={bookmarks}
                    onRemoveBookmark={handleRemoveBookmark}
                    onClearAll={handleClearBookmarks}
                  />
                )}

                {activeTab === 'notifications' && (
                  <NotificationsTab
                    notifications={notifications}
                    onMarkAllRead={handleMarkAllNotificationsRead}
                    onToggleRead={handleToggleNotificationRead}
                  />
                )}

                {activeTab === 'profile' && (
                  <ProfileTab
                    user={user}
                    onUpdateUser={setUser}
                    bookmarksCount={bookmarks.length}
                    onNavigateToAdmin={() => navigate('/admin')}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsTab
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    onNavigateToAdmin={() => navigate('/admin')}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* BOTTOM NAVIGATION BAR */}
          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            unreadNotificationsCount={unreadNotificationsCount}
          />

          {/* ANDROID HOME INDICATOR */}
          <div className="absolute bottom-1 w-full py-0.5 flex justify-center pointer-events-none z-50">
            <div className="w-28 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
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
