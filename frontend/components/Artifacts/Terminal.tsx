"use client";
import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface TerminalProps {
  logs: string[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      theme: {
        background: '#09090b', // zinc-950
        foreground: '#a1a1aa', // zinc-400
        cursor: '#3b82f6', // blue-500
      },
      fontSize: 12,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      cursorBlink: true,
      rows: 20,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;

    return () => {
      term.dispose();
    };
  }, []);

  useEffect(() => {
    if (xtermRef.current && logs.length > 0) {
      // Clear and rewrite or just append? 
      // For now, let's just append the latest log
      const latestLog = logs[logs.length - 1];
      xtermRef.current.writeln(latestLog);
    }
  }, [logs]);

  return (
    <div className="w-full h-full bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
      <div className="flex items-center px-4 py-2 bg-zinc-900 border-b border-zinc-800 space-x-2">
        <div className="w-2 h-2 rounded-full bg-red-500/50" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <div className="w-2 h-2 rounded-full bg-green-500/50" />
        <span className="ml-2 text-[10px] font-mono text-zinc-500">vibe-sandbox:~</span>
      </div>
      <div ref={terminalRef} className="p-2 h-[300px]" />
    </div>
  );
};

export default Terminal;
