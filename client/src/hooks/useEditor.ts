import { useState, useEffect, useRef, useCallback } from 'react';

import type { SnapshotApiContract } from '../api/snapshotApi.types';
import type { SaveStrategy } from '../constants/saveStrategy';
import { DEFAULT_SAVE_STRATEGY } from '../constants/saveStrategy';
import type { Snapshot } from '../domains';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseEditorDeps {
  api: SnapshotApiContract;
  saveStrategy?: SaveStrategy;
}

interface UseEditorReturn {
  content: string;
  setContent: (value: string) => void;
  saveStatus: SaveStatus;
  currentSnapshot: Snapshot | null;
  loadSnapshot: (snapshot: Snapshot) => void;
  isReadOnly: boolean;
  setIsReadOnly: (value: boolean) => void;
  returnToLatest: () => Promise<void>;
}

export function useEditor({ api, saveStrategy = DEFAULT_SAVE_STRATEGY }: UseEditorDeps): UseEditorReturn {
  const [content, setContentState] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [currentSnapshot, setCurrentSnapshot] = useState<Snapshot | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    api.getLatest().then((snapshot) => {
      if (snapshot) {
        setContentState(snapshot.content);
        setCurrentSnapshot(snapshot);
      }
    });
  }, [api]);

  const saveSnapshot = useCallback(async (contentToSave: string) => {
    try {
      setSaveStatus('saving');
      const saved = await api.create(contentToSave);
      setCurrentSnapshot(saved);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  }, [api]);

  const setContent = useCallback((value: string) => {
    if (isReadOnly) return;
    setContentState(value);
    setSaveStatus('idle');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (saveStrategy.shouldSaveImmediately(value)) {
      saveSnapshot(value);
    } else {
      debounceRef.current = setTimeout(() => {
        saveSnapshot(value);
      }, saveStrategy.debounceMs);
    }
  }, [isReadOnly, saveSnapshot, saveStrategy]);

  const loadSnapshot = useCallback((snapshot: Snapshot) => {
    setContentState(snapshot.content);
    setCurrentSnapshot(snapshot);
    setIsReadOnly(!snapshot.is_editable);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const returnToLatest = useCallback(async () => {
    const latest = await api.getLatest();
    if (latest) {
      setContentState(latest.content);
      setCurrentSnapshot(latest);
      setIsReadOnly(false);
    }
  }, [api]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    content,
    setContent,
    saveStatus,
    currentSnapshot,
    loadSnapshot,
    isReadOnly,
    setIsReadOnly,
    returnToLatest,
  };
}
