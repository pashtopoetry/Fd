export interface TelegramMessage {
  id: string;
  text: string;
  date: number;
  chatTitle: string;
  source: string;
  authorAvatar?: string;
  botToken?: string;
}

export interface BotConfig {
  id: string;
  token: string;
  name: string;
  username: string;
}

