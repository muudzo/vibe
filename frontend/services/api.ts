const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  client_id?: string;
  created_at?: string;
}

export interface Chat {
  id: string;
  user_id: string;
  title?: string;
  created_at: string;
}

export interface ToolCall {
  id: string;
  chat_id: string;
  tool_name: string;
  arguments: string;
  status: string;
  created_at: string;
}

export const apiService = {
  async createChat(userId: string, title?: string): Promise<Chat> {
    const response = await fetch(`${API_BASE_URL}/chats/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, title }),
    });
    if (!response.ok) throw new Error('Failed to create chat');
    return response.json();
  },

  async addMessage(chatId: string, role: 'user' | 'assistant', content: string, clientId?: string): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, content, client_id: clientId }),
    });
    if (!response.ok) throw new Error('Failed to add message');
    return response.json();
  },

  async getChatHistory(chatId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/history`);
    if (!response.ok) throw new Error('Failed to fetch chat history');
    return response.json();
  },

  async getPendingTools(chatId: string): Promise<ToolCall[]> {
    const response = await fetch(`${API_BASE_URL}/tools/pending/${chatId}`);
    if (!response.ok) throw new Error('Failed to fetch pending tools');
    return response.json();
  },

  async approveTool(toolCallId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tools/${toolCallId}/approve`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to approve tool');
    return response.json();
  },

  async denyTool(toolCallId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tools/${toolCallId}/deny`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to deny tool');
    return response.json();
  },

  async streamChat(chatId: string, onMessage: (chunk: string) => void): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/stream`);
    if (!response.ok) throw new Error('Failed to start stream');
    
    const reader = response.body?.getReader();
    if (!reader) throw new Error('ReadableStream not supported');

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      onMessage(chunk);
    }
  },
};

