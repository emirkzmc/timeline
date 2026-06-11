import type { Snapshot, SnapshotHistoryItem } from '../domains';

export interface SnapshotApiContract {
  create: (content: string) => Promise<Snapshot>;
  getLatest: () => Promise<Snapshot | null>;
  getHistory: (limit: number, offset: number) => Promise<SnapshotHistoryItem[]>;
  getById: (id: number) => Promise<Snapshot>;
}
