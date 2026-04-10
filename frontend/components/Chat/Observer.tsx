"use client";
import React from 'react';
import { Eye, Terminal, FileText, CheckCircle2, Clock } from 'lucide-react';

interface ObserverLog {
  id: string;
  type: 'thought' | 'action' | 'result';
  content: string;
  timestamp: string;
}

interface ObserverProps {
  logs: ObserverLog[];
}

const Observer: React.FC<ObserverProps> = ({ logs }) => {
  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-inner">
      <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
        <div className="flex items-center space-x-2">
          <Eye size={14} className="text-zinc-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Agent Observer</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex space-x-3">
            <div className="flex flex-col items-center">
              <div className={`p-1.5 rounded-full ${
                log.type === 'thought' ? 'bg-blue-100 text-blue-600' : 
                log.type === 'action' ? 'bg-amber-100 text-amber-600' : 
                'bg-emerald-100 text-emerald-600'
              }`}>
                {log.type === 'thought' && <Clock size={12} />}
                {log.type === 'action' && <Terminal size={12} />}
                {log.type === 'result' && <CheckCircle2 size={12} />}
              </div>
              <div className="w-px h-full bg-zinc-200 dark:bg-zinc-800 my-1" />
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">{log.type}</span>
                <span className="text-[8px] text-zinc-500">{log.timestamp}</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-mono bg-white dark:bg-zinc-800 p-2 rounded-md border border-zinc-100 dark:border-zinc-700">
                {log.content}
              </p>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
            <FileText size={32} className="mb-2" />
            <p className="text-[10px] uppercase font-bold tracking-tighter">No logs yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Observer;
