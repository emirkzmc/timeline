export interface Snapshot {
  id: number;
  content: string;
  version_index: number;
  created_at: string;
  content_hash: string | null;
  parent_id: number | null;
  is_editable: boolean;
}

export interface SnapshotHistoryItem {
  id: number;
  version_index: number;
  created_at: string;
  content_length: number;
}
