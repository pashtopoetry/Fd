export interface TelegramMessage {
  id: string;
  text: string;
  date: number;
  chatTitle: string;
  source: string;
  authorAvatar?: string;
  botToken?: string;
  category?: string;
  likesCount?: number;
}

export interface BotConfig {
  id: string;
  token: string;
  name: string;
  username: string;
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  joinDate: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'update' | 'bot' | 'poetry';
}

export interface SavedItem {
  id: string;
  text: string;
  author: string;
  date: string;
  type: 'telegram' | 'poetry';
}
