import { useState, useEffect, useCallback, useRef } from 'react';

import { snapshotApi } from '../api/snapshotApi';
import { HISTORY_FETCH_LIMIT } from '../constants';
import type { Snapshot, SnapshotHistoryItem } from '../types/snapshot.types';

interface UseTimelineReturn {
  history: SnapshotHistoryItem[];
  selectedId: number | null;
  isViewingLatest: boolean;
  selectVersion: (id: number) => Promise<Snapshot>;
  refreshHistory: () => Promise<void>;
}

export function useTimeline(): UseTimelineReturn {
  const [history, setHistory] = useState<SnapshotHistoryItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const isViewingLatestRef = useRef(false);

  useEffect(() => {
    isViewingLatestRef.current = history.length > 0 && selectedId === history[0]?.id;
  }, [history, selectedId]);

  const refreshHistory = useCallback(async () => {
    const items = await snapshotApi.getHistory(HISTORY_FETCH_LIMIT, 0);
    setHistory(items);
    if (items.length > 0) {
      if (selectedId === null || isViewingLatestRef.current) {
        setSelectedId(items[0].id);
      }
    }
  }, [selectedId]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const isViewingLatest = history.length > 0 && selectedId === history[0]?.id;

  const selectVersion = useCallback(async (id: number): Promise<Snapshot> => {
    setSelectedId(id);
    return snapshotApi.getById(id);
  }, []);

  return { history, selectedId, isViewingLatest, selectVersion, refreshHistory };
}
