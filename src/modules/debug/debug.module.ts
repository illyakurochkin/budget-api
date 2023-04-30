import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from '../source/source.entity';
import { DebugService } from './debug.service';
import { DebugResolver } from './debug.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity])],
  providers: [DebugService, DebugResolver],
  exports: [],
})
export class DebugModule {}
