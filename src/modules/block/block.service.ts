import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BlockEntity } from './block.entity';
import { CreateBlockInput } from './block.interface';
import { SourceEntity } from '../source/source.entity';
import { ExchangeService } from '../exchange/exchange.service';

@Injectable()
export class BlockService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly exchangeService: ExchangeService,
  ) {}

  async findLastBlockBySourceId(
    userId: string,
    sourceId: string,
    date?: Date,
  ): Promise<BlockEntity | null> {
    const blocks = await this.findBlocksBySourceId(userId, sourceId, date);
    const [lastBlock] = blocks.reverse();

    return lastBlock ?? null;
  }

  async findBlocksBySourceId(
    userId: string,
    sourceId: string,
    date?: Date,
  ): Promise<BlockEntity[]> {
    const source = await this.entityManager.findOne(SourceEntity, {
      where: { id: sourceId, userId },
    });

    if (!source) throw new NotFoundException('source not found');

    const blocks = await this.entityManager.find(BlockEntity, {
      where: { sourceId },
    });

    return blocks.filter(
      (block) => !date || new Date(block.date).getTime() <= date.getTime(),
    );
  }

  async createBlock(
    userId: string,
    blockInput: CreateBlockInput,
  ): Promise<BlockEntity> {
    const source = await this.entityManager.findOne(SourceEntity, {
      where: { id: blockInput.sourceId, userId },
    });

    if (!source) throw new NotFoundException('source not found');

    const amountInUSD = await this.exchangeService.convert(
      blockInput.currency,
      'USD',
      blockInput.amount,
    );

    const block = this.entityManager.create(BlockEntity, {
      ...blockInput,
      amountInUSD,
    });

    return this.entityManager.save(BlockEntity, block);
  }

  // async updateBlock(
  //   userId: string,
  //   blockInput: UpdateBlockInput,
  // ): Promise<BlockEntity> {
  //   return {} as BlockEntity;
  // }

  async deleteBlock(userId: string, blockId: string): Promise<string> {
    const block = await this.entityManager.findOne(BlockEntity, {
      where: { id: blockId, source: { userId } },
      relations: ['source'],
    });

    if (!block) throw new NotFoundException('block not found');

    await this.entityManager.delete(BlockEntity, { id: blockId });
    return blockId;
  }
}
