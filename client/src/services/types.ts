// TODO: These types are duplicated from server/types/index.ts
// TODO: Move shared types to a common shared/types/ directory

export interface JoinPayload {
  username: string;
  group: string;
}

export interface ChatMessage {
  content: string;
  timestamp: number;
  username: string;
}

export interface Group {
  id: string;
  name: string;
  createdBy: string;
  createdAt: number;
}
