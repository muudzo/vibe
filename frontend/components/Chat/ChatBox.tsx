"use client";
import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { apiService, Message } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';

interface ChatBoxProps {
  chatId?: string;
  userId: string;
  model: 'claude' | 'ollama';
}

const ChatBox: React.FC<ChatBoxProps> = ({ chatId, userId, model }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(chatId);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentChatId) {
      loadHistory(currentChatId);
    }
  }, [currentChatId]);

  const loadHistory = async (id: string) => {
    try {
      const history = await apiService.getChatHistory(id);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);
    const clientId = uuidv4();
    
    // Optimistic update
    const userMessage: Message = { role: 'user', content, client_id: clientId };
    setMessages((prev) => [...prev, userMessage]);

    try {
      let targetChatId = currentChatId;
      
      // Create chat if it doesn't exist
      if (!targetChatId) {
        const newChat = await apiService.createChat(userId, content.substring(0, 30));
        targetChatId = newChat.id;
        setCurrentChatId(targetChatId);
      }

      // Add user message to backend
      await apiService.addMessage(targetChatId, 'user', content, clientId);

      // Simulate Assistant response for now (v0.1)
      // In v0.2 this will be a streaming call to Claude/Ollama
      setTimeout(async () => {
        const assistantClientId = uuidv4();
        const assistantResponse = "I've received your message. I'm currently in 'Foundation' mode. Soon I'll be able to help you with complex tasks!";
        await apiService.addMessage(targetChatId!, 'assistant', assistantResponse, assistantClientId);
        setMessages((prev) => [...prev, { role: 'assistant', content: assistantResponse, client_id: assistantClientId }]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 shadow-xl rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 flex justify-between items-center">
        <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 italic">Unified AI Agent</h2>
        <div className="flex space-x-4 items-center">
          <div className="flex items-center space-x-1.5 translate-y-[0.5px]">
            <div className={`w-2 h-2 rounded-full ${model === 'claude' ? 'bg-orange-500' : 'bg-purple-500'} shadow-sm`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{model}</span>
          </div>
          <div className="h-3 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />
          <div className="flex space-x-2 items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/20" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active</span>
          </div>
        </div>
      </div>
      
      <MessageList messages={messages} />
      
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatBox;
