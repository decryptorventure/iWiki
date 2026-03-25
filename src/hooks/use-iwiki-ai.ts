// Hook: AI chat session persistence and dispatch
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { AIChatMessage, AIChatSession } from '../types';

export function useIWikiAI() {
  const { state, dispatch } = useApp();

  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  /** Persist current messages as a session snapshot */
  const persistSession = (id: string, topic: string, msgs: AIChatMessage[]) => {
    const session: AIChatSession = {
      id,
      topic: topic.slice(0, 40) + (topic.length > 40 ? '...' : ''),
      messages: msgs,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'SAVE_AI_SESSION', session });
  };

  const loadSession = (session: AIChatSession) => {
    setMessages(session.messages);
    setSessionId(session.id);
  };

  const deleteSession = (id: string) => {
    dispatch({ type: 'DELETE_AI_SESSION', sessionId: id });
    if (sessionId === id) {
      setMessages([]);
      setSessionId(null);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setSessionId(null);
  };

  const trackAIEvent = (type: 'ai_search' | 'ai_write', query: string, meta?: Record<string, unknown>) => {
    dispatch({
      type: 'TRACK_EVENT',
      event: { type, userId: state.currentUser.id, query, meta: meta ?? {} },
    });
  };

  return {
    messages,
    setMessages,
    sessionId,
    setSessionId,
    isTyping,
    setIsTyping,
    sessions: state.aiHistory,
    persistSession,
    loadSession,
    deleteSession,
    startNewChat,
    trackAIEvent,
    currentUser: state.currentUser,
    articles: state.articles,
  };
}
