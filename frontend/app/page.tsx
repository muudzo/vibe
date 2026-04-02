// frontend/app/page.tsx
"use client";
import React, { useState } from 'react';
import ChatBox from '../components/Chat/ChatBox';
import { Cpu, Layout, Settings, Sparkles } from 'lucide-react';

export default function Home() {
  const [model, setModel] = useState<'claude' | 'ollama'>('claude');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans">
      {/* Sidebar - Navigation/Rooms */}
      <div className="w-16 flex flex-col items-center py-4 bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
        <div className="p-2 mb-8 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
          <Sparkles size={24} />
        </div>
        <nav className="flex flex-col space-y-6">
          <button className="p-2 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
            <Layout size={20} />
          </button>
          <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <Cpu size={20} />
          </button>
          <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <Settings size={20} />
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Vibe <span className="text-blue-600 font-light italic">Agent</span></h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <button 
                onClick={() => setModel('claude')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  model === 'claude' 
                    ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Claude 3.5
              </button>
              <button 
                onClick={() => setModel('ollama')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  model === 'ollama' 
                    ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Ollama
              </button>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition-opacity"
            >
              {isSidebarOpen ? 'Close Artifacts' : 'Open Artifacts'}
            </button>
          </div>
        </header>

        {/* Dynamic Panes */}
        <div className="flex-1 flex overflow-hidden p-4 gap-4">
          <div className="flex-1 min-w-0">
            <ChatBox userId="test-user" model={model} />
          </div>
          
          {isSidebarOpen && (
            <div className="w-[40%] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col shadow-xl animate-in slide-in-from-right-4 duration-300">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Artifacts Preview</span>
              </div>
              <div className="flex-1 flex items-center justify-center text-zinc-400 p-8 text-center italic">
                No artifacts produced yet. Ask the agent to generate code, diagrams, or documents.
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
