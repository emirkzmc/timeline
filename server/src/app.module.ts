import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SnapshotModule } from './modules/snapshot/snapshot.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SnapshotModule,
  ],
})
export class AppModule {}