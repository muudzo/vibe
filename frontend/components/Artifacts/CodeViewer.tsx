"use client";
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Download } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language: string;
  filename?: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code, language, filename }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `artifact.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <span className="text-[10px] font-mono text-zinc-400 truncate">{filename || `unnamed.${language}`}</span>
        <div className="flex items-center space-x-1">
          <button 
            onClick={handleDownload}
            className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-md hover:bg-zinc-800"
            title="Download"
          >
            <Download size={14} />
          </button>
          <button 
            onClick={handleCopy}
            className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-md hover:bg-zinc-800"
            title="Copy"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto text-sm">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeViewer;
