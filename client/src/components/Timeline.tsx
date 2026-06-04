import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

import type { SnapshotHistoryItem } from '../domains';

interface TimelineProps {
  history: SnapshotHistoryItem[];
  selectedId: number | null;
  onSelectVersion: (id: number) => void;
  onReturnToLatest: () => void;
  isViewingLatest: boolean;
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function Timeline({ history, selectedId, onSelectVersion, onReturnToLatest, isViewingLatest }: TimelineProps) {
  const [sliderValue, setSliderValue] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (history.length > 0 && selectedId !== null) {
      const index = history.findIndex(h => h.id === selectedId);
      if (index !== -1) {
        setSliderValue(history.length - 1 - index);
      }
    }
  }, [selectedId, history]);

  const handlePointerDown = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
  };

  const handlePointerUp = () => {
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSliderValue(val);
    const index = history.length - 1 - val;
    onSelectVersion(history[index].id);
    
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  if (history.length === 0) {
    return (
      <div className="shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur-md p-4 select-none flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2.5 p-2.5 text-slate-400 font-sans text-[13px] italic">
          <span className="text-base">⏳</span>
          Timeline will appear here as you type...
        </div>
      </div>
    );
  }

  const selectedIndex = history.length - 1 - sliderValue;
  const currentItem = history[selectedIndex];
  const maxVal = history.length - 1;
  const percentage = maxVal === 0 ? 100 : (sliderValue / maxVal) * 100;

  return (
    <div className="shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur-md px-6 py-4 pl-12 select-none flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-sans text-[11px] font-semibold tracking-[1.2px] uppercase text-slate-500">
          <span className="text-sm bg-linear-to-br from-cyan-500 to-purple-500 bg-clip-text text-transparent">⟡</span>
          <span>Time Travel Slider</span>
        </div>
        {currentItem && (
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm font-semibold text-cyan-500 [text-shadow:0_0_10px_rgba(6,182,212,0.4)]">v{currentItem.version_index}</span>
            <span className="font-sans text-xs text-slate-500">{formatTime(currentItem.created_at)}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 w-full">
        <div className="py-2.5 w-full grow pr-2">
          <div className="relative w-full h-6 flex items-center">
            {/* Background track */}
            <div className="absolute left-0 right-0 h-1.5 rounded-[3px] bg-slate-200 pointer-events-none">
              {/* Active track fill */}
              <motion.div 
                className="absolute left-0 top-0 bottom-0 rounded-[3px]"
                style={{ backgroundSize: '300% 100%' }}
                initial={false}
                animate={{ 
                  width: `${percentage}%`,
                  backgroundPosition: `${percentage}% 0%`,
                  backgroundImage: isScrolling
                    ? 'linear-gradient(90deg, #06b6d4, #a78bfa, #f472b6, #8b5cf6)'
                    : 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            </div>
            
            {/* Thumb */}
            <motion.div
              className="absolute w-4 h-4 rounded-full bg-white border-2 pointer-events-none z-10"
              initial={false}
              animate={{ 
                left: `calc(${percentage}% - 8px)`,
                scale: isScrolling ? 1.2 : 1,
                borderColor: isScrolling ? '#8b5cf6' : '#06b6d4',
                boxShadow: isScrolling 
                  ? '0 0 15px rgba(139, 92, 246, 0.6)' 
                  : '0 0 8px rgba(6,182,212,0.4)'
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />

            {/* Invisible Native Input */}
            <input
              type="range"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 m-0 p-0"
              min={0}
              max={maxVal}
              value={sliderValue}
              onChange={handleSliderChange}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
          </div>
        </div>
        
        <motion.button 
          className="shrink-0 px-3 py-1.5 rounded-md bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-sans text-xs font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-emerald-500/25 hover:border-emerald-500/50 transition-colors duration-200"
          onClick={onReturnToLatest}
          title="Jump to Present"
          initial={false}
          animate={{
            opacity: isViewingLatest ? 0 : 1,
            scale: isViewingLatest ? 0.8 : 1,
            pointerEvents: isViewingLatest ? 'none' : 'auto'
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          whileHover={!isViewingLatest ? { y: -1 } : undefined}
          whileTap={!isViewingLatest ? { y: 0 } : undefined}
        >
           Present
        </motion.button>
      </div>
    </div>
  );
}
