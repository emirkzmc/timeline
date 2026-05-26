import { useRef, useEffect, useCallback } from 'react';

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  readOnly: boolean;
}

export function Editor({ content, onChange, readOnly }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lineCount = content.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 20) }, (_, i) => i + 1);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.addEventListener('scroll', handleScroll);
    return () => textarea.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className={`flex-1 flex flex-col relative overflow-hidden rounded-none transition-colors duration-300 ease-in-out ${readOnly ? 'bg-purple-50' : ''}`}>
      {readOnly && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-200 rounded-lg text-purple-600 font-sans text-xs font-semibold tracking-[1.5px] uppercase backdrop-blur-md animate-[badgeFadeIn_0.3s_ease]">
          <span className="text-[8px] animate-pulse">◆</span>
          VIEWING PAST VERSION
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-14 min-w-14 py-5 bg-slate-100 border-r border-slate-200 overflow-hidden select-none" ref={lineNumbersRef}>
          {lines.map((num) => (
            <div key={num} className="h-6 leading-6 pr-4 text-right font-mono text-[13px] text-slate-400 transition-colors duration-150 hover:text-slate-600">{num}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className={`flex-1 p-5 bg-transparent border-none outline-none resize-none font-mono text-sm leading-6 whitespace-pre overflow-auto caret-cyan-500 placeholder:text-slate-300 placeholder:italic ${readOnly ? 'text-slate-500 cursor-default' : 'text-slate-800'}`}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          placeholder="Start typing your code here..."
        />
      </div>
    </div>
  );
}
