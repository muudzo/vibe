"use client";
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = chart;
      mermaid.contentLoaded();
      // Use a more robust way to render in future if this has issues with React lifecycle
      try {
        mermaid.render(`mermaid-${Math.floor(Math.random() * 1000)}`, chart).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        });
      } catch (error) {
        console.error('Mermaid render error:', error);
      }
    }
  }, [chart]);

  return (
    <div className="flex justify-center p-4 bg-white dark:bg-zinc-800 rounded-lg overflow-auto border border-zinc-200 dark:border-zinc-700">
      <div ref={containerRef} className="mermaid" />
    </div>
  );
};

export default MermaidDiagram;
