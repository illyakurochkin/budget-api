import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockEntity } from './block.entity';
import { BlockService } from './block.service';
import { BlockResolver } from './block.resolver';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlockEntity]), ExchangeModule],
  providers: [BlockService, BlockResolver, BlockEntity],
  exports: [BlockService],
})
export class BlockModule {}
