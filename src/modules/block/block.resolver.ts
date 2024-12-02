import { Args, Mutation, Query, Resolver, ID, Context } from '@nestjs/graphql';
import { BlockEntity } from './block.entity';
import { BlockService } from './block.service';
import { CreateBlockInput } from './block.interface';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth-deprecated/jwt-auth.guard';
import { CurrentUser } from '../auth-deprecated/current-user.decorator';

@Resolver(() => BlockEntity)
export class BlockResolver {
  constructor(private readonly blockService: BlockService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [BlockEntity])
  getBlocks(
    @Args('sourceId', { type: () => ID }) sourceId: string,
    @CurrentUser() userId,
  ): Promise<BlockEntity[]> {
    return this.blockService.findBlocksBySourceId(userId, sourceId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => BlockEntity)
  createBlock(
    @Args('input', { type: () => CreateBlockInput })
    blockInput: CreateBlockInput,
    @CurrentUser() userId,
  ): Promise<BlockEntity> {
    return this.blockService.createBlock(userId, blockInput);
  }

  // @Mutation(() => BlockEntity)
  // updateBlock(
  //   @Args('input', { type: () => UpdateBlockInput })
  //   blockInput: UpdateBlockInput,
  // ): Promise<BlockEntity> {
  //   const userId =  'test-user-id';
  //   return this.blockService.updateBlock(userId, blockInput);
  // }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ID)
  deleteBlock(
    @Args('blockId', { type: () => ID }) blockId: string,
    @CurrentUser() userId,
  ): Promise<string> {
    return this.blockService.deleteBlock(userId, blockId);
  }
}
