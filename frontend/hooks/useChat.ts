"use client";
import { useState, useCallback } from 'react';
import { apiService, Message } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

export const useChat = (userId: string, initialChatId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | undefined>(initialChatId);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = useCallback(async (id: string) => {
    try {
      const history = await apiService.getChatHistory(id);
      setMessages(history);
      setChatId(id);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  const sendMessage = async (content: string, model: string) => {
    setIsLoading(true);
    const userClientId = uuidv4();
    
    // Add user message optimistically
    const userMessage: Message = { role: 'user', content, client_id: userClientId };
    setMessages((prev) => [...prev, userMessage]);

    try {
      let targetChatId = chatId;
      if (!targetChatId) {
        const newChat = await apiService.createChat(userId, content.substring(0, 30));
        targetChatId = newChat.id;
        setChatId(targetChatId);
      }

      await apiService.addMessage(targetChatId, 'user', content, userClientId);

      // Start streaming
      const assistantClientId = uuidv4();
      let assistantContent = '';
      
      setMessages((prev) => [...prev, { role: 'assistant', content: '', client_id: assistantClientId }]);

      await apiService.streamChat(targetChatId, (chunk) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.content = assistantContent;
          }
          return newMessages;
        });
      });

      await apiService.addMessage(targetChatId, 'assistant', assistantContent, assistantClientId);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    currentChatId: chatId,
    isLoading,
    sendMessage,
    loadHistory,
    setMessages
  };
};

