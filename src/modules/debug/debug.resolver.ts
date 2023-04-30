import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { DebugService } from './debug.service';
import { SourceEntity } from '../source/source.entity';
import { BlockEntity } from '../block/block.entity';

@Resolver()
export class DebugResolver {
  constructor(private readonly debugService: DebugService) {}

  @Mutation(() => Boolean)
  async debug_createTestData(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<boolean> {
    await this.debugService.createTestData(userId);
    return true;
  }

  @Query(() => [SourceEntity])
  async debug_getAllSources(): Promise<SourceEntity[]> {
    return this.debugService.getAllSources();
  }

  @Query(() => [BlockEntity])
  async debug_getAllBlocks(): Promise<BlockEntity[]> {
    return this.debugService.getAllBlocks();
  }
}
