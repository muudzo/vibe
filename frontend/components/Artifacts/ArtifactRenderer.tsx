"use client";
import MermaidDiagram from './MermaidDiagram';
import CodeViewer from './CodeViewer';
import Terminal from './Terminal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type ArtifactType = 'code' | 'diagram' | 'markdown' | 'terminal';

interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  content: string;
  language?: string;
  filename?: string;
  logs?: string[];
}

interface ArtifactRendererProps {
  artifact: Artifact;
}

const ArtifactRenderer: React.FC<ArtifactRendererProps> = ({ artifact }) => {
  switch (artifact.type) {
    case 'diagram':
      return <MermaidDiagram chart={artifact.content} />;
    case 'code':
      return (
        <CodeViewer 
          code={artifact.content} 
          language={artifact.language || 'typescript'} 
          filename={artifact.filename} 
        />
      );
    case 'terminal':
      return <Terminal logs={artifact.logs || []} />;
    case 'markdown':

      return (
        <div className="prose dark:prose-invert max-w-none p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {artifact.content}
          </ReactMarkdown>
        </div>
      );
    default:
      return (
        <div className="p-8 text-center text-zinc-500 italic bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
          Unsupported artifact type: {artifact.type}
        </div>
      );
  }
};

export default ArtifactRenderer;
