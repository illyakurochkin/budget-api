import {
  Args,
  Context,
  Info,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  ChartInput,
  ChartType,
  HistoryItem,
  Summary,
} from './summary.interface';
import { SummaryService } from './summary.service';
import { SourceEntity } from '../source/source.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth-deprecated/jwt-auth.guard';
import { CurrentUser } from '../auth-deprecated/current-user.decorator';

@Resolver(() => SourceEntity)
export class SummaryResolver {
  constructor(private readonly summaryService: SummaryService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => Summary)
  getSummary(
    @CurrentUser() userId,
    @Args('currency', {
      type: () => String,
      nullable: true,
      defaultValue: 'USD',
    })
    currency: string,
  ): Promise<Summary> {
    return this.summaryService.getSummary(userId, currency);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [HistoryItem])
  async getChart(
    @CurrentUser() userId,
    @Args('input', {
      type: () => ChartInput,
      nullable: true,
      defaultValue: {
        type: ChartType.AMOUNT_IN_USD,
        tags: [],
      },
    })
    input: ChartInput,
  ): Promise<HistoryItem[]> {
    if (input.tags.length !== 0 && input.sourceId)
      throw new Error('invalid input (tags and sourceId are both specified)');
    return this.summaryService.getChart(userId, input);
  }

  @ResolveField('dominance', () => Number)
  async getSourceDominance(
    @Parent() source: SourceEntity,
    @Info() info,
    @Context() context,
  ): Promise<number> {
    const date = context.variables?.date ?? null;
    const historyItems = await this.summaryService.getChart(source.userId, {
      type: ChartType.DOMINANCE,
      sourceId: source.id,
    });

    if (!historyItems.length) return 0;

    return (
      historyItems
        .reverse()
        .find(
          (historyItem) => !date || historyItem.date.getTime() < date.getTime(),
        ).value ?? 0
    );
  }
}
