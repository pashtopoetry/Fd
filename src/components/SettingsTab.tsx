import React, { useState } from 'react';
import { Moon, Sun, ShieldCheck, Bell, Smartphone, HelpCircle, ChevronLeft, Type, Info } from 'lucide-react';

interface SettingsTabProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onNavigateToAdmin: () => void;
}

export default function SettingsTab({
  darkMode,
  setDarkMode,
  onNavigateToAdmin,
}: SettingsTabProps) {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="space-y-5 pb-28" dir="rtl">
      <div>
        <h2 className="text-lg font-extrabold text-neutral-850 dark:text-neutral-100">
          د اپلیکیشن ترتیبات (Settings)
        </h2>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
          شخصي تنظیمات، ظاهري بڼه او د سیستم اجازه لیکونه
        </p>
      </div>

      {/* APPEARANCE SECTION */}
      <div className="bg-white dark:bg-neutral-850 rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
        <h3 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">
          ظاهري بڼه (Appearance)
        </h3>

        {/* THEME TOGGLE */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-850 dark:text-neutral-100">
                شپې بڼه (Dark Mode)
              </div>
              <div className="text-xs text-neutral-400">د سترګو د ساتنې او ژورې تیاره بڼې لپاره</div>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              darkMode ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-neutral-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                darkMode ? '-translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* FONT SIZE */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-500">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-850 dark:text-neutral-100">
                د فونټ کچه (Font Size)
              </div>
              <div className="text-xs text-neutral-400">د لیکنو د متنو اندازه</div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  fontSize === s
                    ? 'bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-neutral-500'
                }`}
              >
                {s === 'sm' ? 'کوچنی' : s === 'md' ? 'متوسط' : 'لوی'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS & ADMIN */}
      <div className="bg-white dark:bg-neutral-850 rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
        <h3 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">
          سیستم او تنظیمات
        </h3>

        {/* NOTIFICATIONS PUSH TOGGLE */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-850 dark:text-neutral-100">
                د خبرتیاوو غږونه او پورته کول
              </div>
              <div className="text-xs text-neutral-400">د نوې لیکنې له شایع کېدو سمدستي خبرتیا</div>
            </div>
          </div>

          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              notificationsEnabled ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-neutral-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                notificationsEnabled ? '-translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* ADMIN PANEL LINK */}
        <div
          onClick={onNavigateToAdmin}
          className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-850 dark:text-neutral-100">
                د اډمین پینل (Admin Control)
              </div>
              <div className="text-xs text-neutral-400">د تلګرام بوټ ټوکن او لاسي لیکنو زیاول</div>
            </div>
          </div>

          <ChevronLeft className="w-5 h-5 text-neutral-400 group-hover:-translate-x-1 transition-transform" />
        </div>
      </div>

      {/* APP INFO */}
      <div className="bg-white dark:bg-neutral-850 rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800 space-y-3 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-neutral-850 dark:text-neutral-100">
            پښتو ادب اپلیکیشن
          </h4>
          <p className="text-xs text-neutral-400">Version 2.4 (Android & Web Build)</p>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
          د پښتو بډای فرهنګ، روښانه ادب او شعرونو له نوي عصري تخنیک او تلګرام اتومات وصل سره.
        </p>
      </div>
    </div>
  );
}
