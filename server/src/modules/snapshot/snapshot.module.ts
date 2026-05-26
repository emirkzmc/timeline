import { Module } from '@nestjs/common';

import { SnapshotController } from './snapshot.controller.js';
import { SnapshotService } from './snapshot.service.js';
import { SnapshotRepository } from './snapshot.repository.js';
import { DatabaseProvider } from '../../db/postgres.js';

@Module({
  controllers: [SnapshotController],
  providers: [DatabaseProvider, SnapshotRepository, SnapshotService],
})
export class SnapshotModule {}
