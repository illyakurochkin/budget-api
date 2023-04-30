import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Info,
  Parent,
  Mutation,
  ID,
  Context,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SourceEntity } from './source.entity';
import { SourceService } from './source.service';
import { CreateSourceInput, UpdateSourceInput } from './source.interface';
import { BlockService } from '../block/block.service';
import { BlockEntity } from '../block/block.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => SourceEntity)
export class SourceResolver {
  constructor(
    private readonly sourceService: SourceService,
    private readonly blockService: BlockService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => SourceEntity)
  async createSource(
    @Args('input', { type: () => CreateSourceInput })
    sourceInput: CreateSourceInput,
    @CurrentUser() userId,
  ): Promise<SourceEntity> {
    return this.sourceService.createSource(userId, sourceInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => SourceEntity)
  async updateSource(
    @Args('sourceId', { type: () => ID }) sourceId: string,
    @Args('input', { type: () => UpdateSourceInput })
    sourceInput: UpdateSourceInput,
    @CurrentUser() userId,
  ): Promise<SourceEntity> {
    return this.sourceService.updateSource(userId, sourceId, sourceInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ID)
  async deleteSource(
    @Args('sourceId', { type: () => ID }) sourceId: string,
    @CurrentUser() userId,
  ): Promise<string> {
    return this.sourceService.deleteSource(userId, sourceId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [SourceEntity])
  async getSources(
    @Args('date', { type: () => Date, nullable: true }) date: Date,
    @Args('tags', { type: () => [String], nullable: true }) tags: string[],
    @Context() context,
    @CurrentUser() userId,
  ): Promise<SourceEntity[]> {
    context.variables = { date };
    return this.sourceService.findSources(userId, tags);
  }

  @ResolveField('amount', () => Number)
  async getSourceAmount(
    @Parent() source: SourceEntity,
    @Info() info,
    @Context() context,
  ): Promise<number> {
    const date = context.variables?.date ?? null;
    const lastBlock = await this.blockService.findLastBlockBySourceId(
      source.userId,
      source.id,
      date,
    );

    return lastBlock?.amount ?? 0;
  }

  @ResolveField('currency', () => String)
  async getSourceCurrency(
    @Parent() source: SourceEntity,
    @Info() info,
    @Context() context,
  ): Promise<string> {
    const date = context.variables?.date ?? null;
    const lastBlock = await this.blockService.findLastBlockBySourceId(
      source.userId,
      source.id,
      date,
    );

    return lastBlock?.currency ?? 'USD';
  }

  @ResolveField('amountInUSD', () => Number)
  async getSourceAmountInUSD(
    @Parent() source: SourceEntity,
    @Info() info,
    @Context() context,
  ): Promise<number> {
    const date = context.variables?.date ?? null;
    const lastBlock = await this.blockService.findLastBlockBySourceId(
      source.userId,
      source.id,
      date,
    );

    return lastBlock?.amountInUSD ?? 0;
  }

  @ResolveField('date', () => Date)
  async getSourceDate(
    @Parent() source: SourceEntity,
    @Info() info,
    @Context() context,
  ): Promise<Date> {
    const date = context.variables?.date ?? null;
    const lastBlock = await this.blockService.findLastBlockBySourceId(
      source.userId,
      source.id,
      date,
    );

    return new Date(lastBlock?.date ?? source.updatedAt);
  }

  @ResolveField('blocks', () => [BlockEntity])
  async getSourceBlocks(
    @Parent() source: SourceEntity,
    @Info() info,
    @Context() context,
  ): Promise<BlockEntity[]> {
    const date = context.variables?.date ?? null;
    return this.blockService.findBlocksBySourceId(
      source.userId,
      source.id,
      date,
    );
  }

  // get summary by tags and currency
  // returns the list of blocks that have all the tags from the request
  // also the response has `total` which is converted to the candidate currency
  // and `percentage` that shows the % of total budget for the user

  // get summary for budget by currencies
  // total amount
  // total and % for each tag
  // the result if shown in different currencies
}
