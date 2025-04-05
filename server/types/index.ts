export interface JoinPayload {
  username: string;
  group: string;
}

export interface ChatMessage {
  content: string;
  timestamp?: number;
  username?: string;
}
