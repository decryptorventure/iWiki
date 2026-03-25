// AI chat domain types

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIChatSession {
  id: string;
  topic: string;
  messages: AIChatMessage[];
  updatedAt: string;
}
