import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';

import { SnapshotService } from './snapshot.service.js';
import type { CreateSnapshotPayload } from '../../domains/index.js';

@Controller('snapshot')
export class SnapshotController {
  constructor(private readonly service: SnapshotService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateSnapshotPayload) {
    return this.service.createSnapshot(body.content);
  }

  @Get('latest')
  getLatest() {
    return this.service.getLatest();
  }

  @Get('history')
  getHistory(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.service.getHistory(
      limit ? parseInt(limit, 10) : 50,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }
}
