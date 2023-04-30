import { Injectable } from '@nestjs/common';
import { Any, EntityManager } from 'typeorm';
import { SourceEntity } from './source.entity';
import { CreateSourceInput, UpdateSourceInput } from './source.interface';

@Injectable()
export class SourceService {
  constructor(private readonly entityManager: EntityManager) {}

  // async findSources(userId: string): Promise<SourceEntity[]> {
  //   return this.entityManager.find(SourceEntity, { where: { userId } });
  // }

  async findSourceById(
    userId: string,
    sourceId: string,
  ): Promise<SourceEntity> {
    const source = await this.entityManager.findOne(SourceEntity, {
      where: { id: sourceId, userId },
    });
    if (!source) throw 'source not found';
    return source;
  }

  async findSources(userId: string, tags?: string[]): Promise<SourceEntity[]> {
    const qb = this.entityManager.createQueryBuilder(SourceEntity, 'source');
    qb.where('"userId" = :userId', { userId });
    if (tags) {
      qb.andWhere('"tags" <@ array[:tags]::text[]', { tags });
    }
    return qb.getMany();
  }

  async createSource(
    userId: string,
    sourceInput: CreateSourceInput,
  ): Promise<SourceEntity> {
    const source = this.entityManager.create(SourceEntity, {
      name: sourceInput.name,
      tags: sourceInput.tags ?? [],
      userId,
    });
    return this.entityManager.save(SourceEntity, source);
  }

  async updateSource(
    userId: string,
    sourceId: string,
    sourceInput: UpdateSourceInput,
  ): Promise<SourceEntity> {
    await this.findSourceById(userId, sourceId);
    await this.entityManager.update(
      SourceEntity,
      { id: sourceId, userId },
      sourceInput,
    );
    return this.findSourceById(userId, sourceId);
  }

  async deleteSource(userId: string, sourceId: string): Promise<string> {
    await this.findSourceById(userId, sourceId);
    await this.entityManager.delete(SourceEntity, { id: sourceId, userId });
    return sourceId;
  }

  // async findSourcedByDate(userId: string, date: Date): Promise<SourceEntity[]> {
  //   return this.entityManager.find(SourceEntity, {
  //     where: { userId },
  //   });
  // }
}
