import { useState, useEffect, useRef, useCallback } from 'react';

import { snapshotApi } from '../api/snapshotApi';
import { DEBOUNCE_DELAY_MS } from '../constants';
import type { Snapshot } from '../types/snapshot.types';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

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

export function useEditor(): UseEditorReturn {
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
    snapshotApi.getLatest().then((snapshot) => {
      if (snapshot) {
        setContentState(snapshot.content);
        setCurrentSnapshot(snapshot);
      }
    });
  }, []);

  const saveSnapshot = useCallback(async (contentToSave: string) => {
    try {
      setSaveStatus('saving');
      const saved = await snapshotApi.create(contentToSave);
      setCurrentSnapshot(saved);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  }, []);

  const setContent = useCallback((value: string) => {
    if (isReadOnly) return;
    setContentState(value);
    setSaveStatus('idle');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    const lastChar = value.slice(-1);
    if ([' ', '\n', '.', ',', ';', '(', '{', '['].includes(lastChar)) {
      saveSnapshot(value);
    } else {
      debounceRef.current = setTimeout(() => {
        saveSnapshot(value);
      }, DEBOUNCE_DELAY_MS);
    }
  }, [isReadOnly, saveSnapshot]);

  const loadSnapshot = useCallback((snapshot: Snapshot) => {
    setContentState(snapshot.content);
    setCurrentSnapshot(snapshot);
    setIsReadOnly(!snapshot.is_editable);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const returnToLatest = useCallback(async () => {
    const latest = await snapshotApi.getLatest();
    if (latest) {
      setContentState(latest.content);
      setCurrentSnapshot(latest);
      setIsReadOnly(false);
    }
  }, []);

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
