import { useCallback, useEffect, useRef } from 'react';

import { useEditor } from './hooks/useEditor';
import { useTimeline } from './hooks/useTimeline';
import { StatusBar } from './components/StatusBar';
import { Editor } from './components/Editor';
import { Timeline } from './components/Timeline';

function App() {
  const editor = useEditor();
  const timeline = useTimeline();
  const prevSaveStatusRef = useRef(editor.saveStatus);

  const handleSelectVersion = useCallback(async (id: number) => {
    const snapshot = await timeline.selectVersion(id);
    editor.loadSnapshot(snapshot);
  }, [timeline.selectVersion, editor.loadSnapshot]);

  const handleReturnToLatest = useCallback(async () => {
    await editor.returnToLatest();
    await timeline.refreshHistory();
    if (timeline.history.length > 0) {
      timeline.selectVersion(timeline.history[0].id);
    }
  }, [editor.returnToLatest, timeline]);

  useEffect(() => {
    if (prevSaveStatusRef.current === 'saving' && editor.saveStatus === 'saved') {
      timeline.refreshHistory();
    }
    prevSaveStatusRef.current = editor.saveStatus;
  }, [editor.saveStatus, timeline.refreshHistory]);

  return (
    <div className={`relative flex flex-col w-screen h-screen m-0 p-0 bg-white overflow-hidden ${editor.saveStatus === 'saving' ? 'animate-pulse' : ''}`}>
      <div className="relative z-10 flex flex-col h-full w-full">
        <StatusBar
          saveStatus={editor.saveStatus}
          currentSnapshot={editor.currentSnapshot}
          isReadOnly={editor.isReadOnly}
          onReturnToLatest={handleReturnToLatest}
        />
        <Editor
          content={editor.content}
          onChange={editor.setContent}
          readOnly={editor.isReadOnly}
        />
        <Timeline
          history={timeline.history}
          selectedId={timeline.selectedId}
          onSelectVersion={handleSelectVersion}
          onReturnToLatest={handleReturnToLatest}
          isViewingLatest={timeline.isViewingLatest}
        />
      </div>
    </div>
  );
}

export default App;
