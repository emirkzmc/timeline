import type { Snapshot } from '../domains';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface StatusBarProps {
  saveStatus: SaveStatus;
  currentSnapshot: Snapshot | null;
  isReadOnly: boolean;
  onReturnToLatest: () => void;
}

function formatTimeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function getSaveStatusDisplay(status: SaveStatus): { text: string; className: string } {
  const statusMap: Record<SaveStatus, { text: string; className: string }> = {
    idle: { text: 'Ready', className: 'text-slate-500' },
    saving: { text: 'Saving...', className: 'text-amber-500' },
    saved: { text: 'Saved', className: 'text-emerald-500' },
    error: { text: 'Error saving', className: 'text-red-500' },
  };
  return statusMap[status];
}

export function StatusBar({ saveStatus, currentSnapshot, isReadOnly, onReturnToLatest }: StatusBarProps) {
  const statusDisplay = getSaveStatusDisplay(saveStatus);

  return (
    <header className="flex items-center justify-between h-13 px-8 bg-white/80 backdrop-blur-xl border-b border-slate-200 select-none z-50 shrink-0">
      <div className="flex-1">
        <div className="flex items-center gap-2.5">
          
          <span className="font-sans text-[15px] font-semibold text-slate-800 tracking-tight">Timeline</span>
        </div>
      </div>

      <div className="flex-2 flex justify-center">
        {currentSnapshot && (
          <div className="flex items-center gap-2.5 font-sans text-[13px]">
            <span className="text-cyan-500 font-semibold font-mono text-[12px] py-0.5 px-2 bg-cyan-500/10 rounded">v{currentSnapshot.version_index}</span>
            <span className="text-slate-300">·</span>
            <span className={`font-medium transition-colors duration-300 ${statusDisplay.className}`}>
              {statusDisplay.text}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">
              {formatTimeAgo(currentSnapshot.created_at)}
            </span>
          </div>
        )}
        {!currentSnapshot && (
          <span className="text-slate-400 text-[13px] italic">No snapshots yet — start typing!</span>
        )}
      </div>

      <div className="flex-1 flex justify-end">
        {isReadOnly ? (
          <button 
            className="invisible px-4 py-1.5 border border-purple-500/40 rounded-lg bg-purple-500/10 text-purple-400 font-sans text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-purple-500/20 hover:border-purple-500/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
            onClick={onReturnToLatest}
          >
             Return to Latest
          </button>
        ) : (
          <div className="flex items-center gap-2 font-sans text-[11px] font-bold tracking-[1.5px] text-emerald-500">
            
            LIVE
          </div>
        )}
      </div>
    </header>
  );
}
