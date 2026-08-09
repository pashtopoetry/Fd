import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Edit3, Bookmark, Sparkles, BookOpen, ShieldCheck, Share2, Check, Award } from 'lucide-react';
import { UserProfile, SavedItem } from '../types';

interface ProfileTabProps {
  user: UserProfile;
  onUpdateUser: (newUser: UserProfile) => void;
  bookmarksCount: number;
  onNavigateToAdmin: () => void;
}

export default function ProfileTab({
  user,
  onUpdateUser,
  bookmarksCount,
  onNavigateToAdmin,
}: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [bioInput, setBioInput] = useState(user.bio);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSaveProfile = () => {
    onUpdateUser({
      ...user,
      name: nameInput.trim() || 'پښتو مینه وال',
      bio: bioInput.trim(),
    });
    setIsEditing(false);
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'پښتو ادب اپلیکیشن',
        text: 'د پښتو ادب ملګری بې ساري اپلیکیشن ډاونلوډ کړئ!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-28" dir="rtl">
      {/* PROFILE HEADER CARD */}
      <div className="bg-white dark:bg-neutral-850 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-sm relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-lg">
              <div className="w-full h-full bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-neutral-850 dark:text-neutral-100">
                  {user.name}
                </h2>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xs text-neutral-400 font-mono" dir="ltr">
                @{user.username}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                {user.bio || 'د پښتو ادب او شعر مینه وال'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title="ویرایش"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* EDIT FORM DRAWER */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-3"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">ستاسو نوم</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-sm text-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400">ستاسو بیوګرافي</label>
                <input
                  type="text"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-sm text-neutral-800 dark:text-neutral-100"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs transition-colors"
              >
                تغییرات خوندي کړه
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-neutral-850 p-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 text-center space-y-1">
          <Bookmark className="w-5 h-5 text-amber-500 mx-auto" />
          <div className="text-lg font-extrabold text-neutral-850 dark:text-neutral-100">
            {bookmarksCount}
          </div>
          <div className="text-[11px] text-neutral-400 font-medium">خوندي شوي</div>
        </div>

        <div className="bg-white dark:bg-neutral-850 p-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 text-center space-y-1">
          <BookOpen className="w-5 h-5 text-emerald-500 mx-auto" />
          <div className="text-lg font-extrabold text-neutral-850 dark:text-neutral-100">
            120+
          </div>
          <div className="text-[11px] text-neutral-400 font-medium">لوستل شوي</div>
        </div>

        <div className="bg-white dark:bg-neutral-850 p-4 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 text-center space-y-1">
          <Sparkles className="w-5 h-5 text-teal-500 mx-auto" />
          <div className="text-lg font-extrabold text-neutral-850 dark:text-neutral-100">
            ۲۴
          </div>
          <div className="text-[11px] text-neutral-400 font-medium">AI شعرونه</div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white dark:bg-neutral-850 rounded-3xl p-4 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
        <button
          onClick={onNavigateToAdmin}
          className="w-full p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between text-neutral-850 dark:text-neutral-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">د اډمین انډول (Admin Panel)</div>
              <div className="text-[11px] text-neutral-400">د تلګرام بوټونو او لیکنو کنټرول</div>
            </div>
          </div>
        </button>

        <button
          onClick={handleShareApp}
          className="w-full p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between text-neutral-850 dark:text-neutral-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">له ملګرو سره اپ شریک کړئ</div>
              <div className="text-[11px] text-neutral-400">
                {copiedLink ? 'لینک کاپي شو!' : 'د اپلیکیشن لینک لېږل'}
              </div>
            </div>
          </div>
          {copiedLink && <Check className="w-4 h-4 text-emerald-500" />}
        </button>
      </div>
    </div>
  );
}
