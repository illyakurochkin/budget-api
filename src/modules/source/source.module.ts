import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from './source.entity';
import { SourceResolver } from './source.resolver';
import { BlockModule } from '../block/block.module';

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity]), BlockModule],
  providers: [SourceService, SourceResolver, SourceEntity],
  exports: [SourceService],
})
export class SourceModule {}
