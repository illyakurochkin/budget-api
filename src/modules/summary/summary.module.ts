import { Module } from '@nestjs/common';
import { SourceModule } from '../source/source.module';
import { BlockModule } from '../block/block.module';
import { SummaryService } from './summary.service';
import { SummaryResolver } from './summary.resolver';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [SourceModule, BlockModule, ExchangeModule],
  exports: [SummaryService],
  providers: [SummaryResolver, SummaryService],
})
export class SummaryModule {}
