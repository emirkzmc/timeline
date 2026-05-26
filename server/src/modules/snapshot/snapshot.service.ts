import { Injectable, NotFoundException } from '@nestjs/common';

import { SnapshotRepository } from './snapshot.repository.js';
import type { Snapshot, SnapshotHistoryItem } from '../../types/snapshot.types.js';

export interface SnapshotWithEditState extends Snapshot {
  is_editable: boolean;
}

@Injectable()
export class SnapshotService {
  constructor(private readonly repository: SnapshotRepository) {}

  async createSnapshot(content: string): Promise<Snapshot> {
    return this.repository.create(content);
  }

  async getLatest(): Promise<SnapshotWithEditState | null> {
    const snapshot = await this.repository.findLatest();
    if (!snapshot) return null;
    return { ...snapshot, is_editable: true };
  }

  async getById(id: number): Promise<SnapshotWithEditState> {
    const snapshot = await this.repository.findById(id);
    if (!snapshot) {
      throw new NotFoundException(`Snapshot with id ${id} not found`);
    }

    const latest = await this.repository.findLatest();
    const isEditable = latest !== null && latest.id === snapshot.id;

    return { ...snapshot, is_editable: isEditable };
  }

  async getHistory(limit: number, offset: number): Promise<SnapshotHistoryItem[]> {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const safeOffset = Math.max(offset, 0);
    return this.repository.findHistory(safeLimit, safeOffset);
  }
}
