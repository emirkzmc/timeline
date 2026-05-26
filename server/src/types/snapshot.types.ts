export interface Snapshot {
  id: number;
  content: string;
  version_index: number;
  created_at: string;
  content_hash: string | null;
  parent_id: number | null;
}

export interface CreateSnapshotPayload {
  content: string;
}

export interface SnapshotHistoryItem {
  id: number;
  version_index: number;
  created_at: string;
  content_length: number;
}
