import { API_BASE_URL } from '../constants';
import type { Snapshot, SnapshotHistoryItem } from '../types/snapshot.types';

export const snapshotApi = {
  create: async (content: string): Promise<Snapshot> => {
    const response = await fetch(`${API_BASE_URL}/snapshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to create snapshot');
    return response.json();
  },

  getLatest: async (): Promise<Snapshot | null> => {
    const response = await fetch(`${API_BASE_URL}/snapshot/latest`);
    if (!response.ok) throw new Error('Failed to fetch latest snapshot');
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  },

  getHistory: async (limit = 100, offset = 0): Promise<SnapshotHistoryItem[]> => {
    const response = await fetch(`${API_BASE_URL}/snapshot/history?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  },

  getById: async (id: number): Promise<Snapshot> => {
    const response = await fetch(`${API_BASE_URL}/snapshot/${id}`);
    if (!response.ok) throw new Error('Failed to fetch snapshot');
    return response.json();
  },
};
