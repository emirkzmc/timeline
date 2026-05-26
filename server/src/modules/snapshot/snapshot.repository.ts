import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

import { DB_POOL } from '../../db/postgres.js';
import type { Snapshot, SnapshotHistoryItem } from '../../types/snapshot.types.js';

@Injectable()
export class SnapshotRepository {
  constructor(@Inject(DB_POOL) private readonly pool: Pool) {}

  async create(content: string): Promise<Snapshot> {
    const result = await this.pool.query<Snapshot>(
      'INSERT INTO snapshots (content) VALUES ($1) RETURNING *',
      [content],
    );
    return result.rows[0];
  }

  async findLatest(): Promise<Snapshot | null> {
    const result = await this.pool.query<Snapshot>(
      'SELECT * FROM snapshots ORDER BY version_index DESC LIMIT 1',
    );
    return result.rows[0] ?? null;
  }

  async findById(id: number): Promise<Snapshot | null> {
    const result = await this.pool.query<Snapshot>(
      'SELECT * FROM snapshots WHERE id = $1',
      [id],
    );
    return result.rows[0] ?? null;
  }

  async findHistory(limit: number, offset: number): Promise<SnapshotHistoryItem[]> {
    const result = await this.pool.query<SnapshotHistoryItem>(
      `SELECT id, version_index, created_at, LENGTH(content) as content_length
       FROM snapshots
       ORDER BY version_index DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return result.rows;
  }
}
