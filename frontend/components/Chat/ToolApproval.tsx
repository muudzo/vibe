"use client";
import React from 'react';
import { Shield, Check, X, Terminal } from 'lucide-react';

interface ToolCall {
  id: string;
  tool_name: string;
  arguments: string;
  status: string;
}

interface ToolApprovalProps {
  toolCall: ToolCall;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

const ToolApproval: React.FC<ToolApprovalProps> = ({ toolCall, onApprove, onDeny }) => {
  const args = JSON.parse(toolCall.arguments);

  return (
    <div className="my-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
          <Shield size={16} />
        </div>
        <span className="text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Security Gate</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Terminal size={14} className="text-zinc-400" />
          <span className="text-sm font-mono font-medium text-zinc-900 dark:text-zinc-100">{toolCall.tool_name}</span>
        </div>
        
        <div className="p-3 bg-zinc-900 rounded-lg overflow-x-auto">
          <pre className="text-xs text-zinc-300 font-mono">
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>

        <div className="flex space-x-2 pt-2">
          <button 
            onClick={() => onApprove(toolCall.id)}
            className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Check size={14} />
            <span>Approve Execution</span>
          </button>
          <button 
            onClick={() => onDeny(toolCall.id)}
            className="flex-1 flex items-center justify-center space-x-2 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors text-sm font-medium"
          >
            <X size={14} />
            <span>Deny</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolApproval;
