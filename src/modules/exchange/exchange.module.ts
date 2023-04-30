import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ExchangeService],
  exports: [ExchangeService],
})
export class ExchangeModule {}
