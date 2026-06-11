import axios from 'axios';
import { API_BASE_URL } from '../constants';
import type { Snapshot, SnapshotHistoryItem } from '../domains';
import { SnapshotMethodNames } from './methodNames'; // Enum aynen kalıyor

export const snapshotApi = {
  create: async (content: string): Promise<Snapshot> => {
    const response = await axios.post<Snapshot>(
      `${API_BASE_URL}${SnapshotMethodNames.CREATE}`,
      { content }
    );
    return response.data;
  },

  getLatest: async (): Promise<Snapshot | null> => {
    const response = await axios.get<Snapshot | null>(
      `${API_BASE_URL}${SnapshotMethodNames.GET_LATEST}`
    );
    return response.data || null;
  },

  getHistory: async (limit = 100, offset = 0): Promise<SnapshotHistoryItem[]> => {
    const response = await axios.get<SnapshotHistoryItem[]>(
      `${API_BASE_URL}${SnapshotMethodNames.GET_HISTORY}`,
      {
        params: { limit, offset },
      }
    );
    return response.data;
  },

  getById: async (id: number): Promise<Snapshot> => {
    const response = await axios.get<Snapshot>(
      `${API_BASE_URL}${SnapshotMethodNames.GET_BY_ID}/${id}`
    );
    return response.data;
  },
};