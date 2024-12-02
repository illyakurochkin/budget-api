import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { SourceEntity } from '../source/source.entity';
import { BlockEntity } from '../block/block.entity';

@Injectable()
export class DebugService {
  constructor(private readonly entityManager: EntityManager) {}

  async createTestBlocks(sourceId: string): Promise<BlockEntity[]> {
    const NUMBER_OF_TEST_BLOCKS = 10;

    const blocks = [];
    for (let i = 0; i < NUMBER_OF_TEST_BLOCKS; i++) {
      const date = new Date();
      date.setDate(-(NUMBER_OF_TEST_BLOCKS - i) * 10);

      const amount =
        ((NUMBER_OF_TEST_BLOCKS - i) * 1000 * (Math.random() + 0.75)) /
        NUMBER_OF_TEST_BLOCKS;

      const block = this.entityManager.create(BlockEntity, {
        date,
        amount,
        amountInUSD: amount,
        currency: 'USD',
        sourceId,
      });

      blocks.push(block);
    }

    return this.entityManager.save(BlockEntity, blocks);
  }

  async createTestSources(userId: string): Promise<SourceEntity[]> {
    const NUMBER_OF_TEST_SOURCES = 10;

    const sources = [];

    for (let i = 0; i < NUMBER_OF_TEST_SOURCES; i++) {
      const source = this.entityManager.create(SourceEntity, {
        name: `Source-${i + 1}`,
        tags: [
          i % 2 === 0 ? 'crypto' : 'bank',
          i % 2 === 0 && i % 3 === 0 ? 'custodial' : 'non-custodial',
        ],
        order: i,
        userId,
      });

      sources.push(source);
    }

    return this.entityManager.save(SourceEntity, sources);
  }

  async createTestData(userId: string): Promise<void> {
    // throw new Error('disabled');
    const sources = await this.createTestSources(userId);

    await Promise.all(
      sources.map((source) => this.createTestBlocks(source.id)),
    );
  }

  async getAllSources(): Promise<SourceEntity[]> {
    return this.entityManager.find(SourceEntity);
  }

  async getAllBlocks(): Promise<BlockEntity[]> {
    return this.entityManager.find(BlockEntity);
  }
}
