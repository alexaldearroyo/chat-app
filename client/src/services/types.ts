// TODO: These types are duplicated from server/types/index.ts
// In production, consider moving them to a shared/types/ folder.

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
