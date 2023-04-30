import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { SourceService } from '../source/source.service';
import { BlockService } from '../block/block.service';
import {
  ChartInput,
  ChartType,
  HistoryItem,
  Summary,
} from './summary.interface';
import { SourceEntity } from '../source/source.entity';
import { format, parse, startOfDay } from 'date-fns';
import { BlockEntity } from '../block/block.entity';
import { ExchangeService } from '../exchange/exchange.service';

const DATE_FORMAT = 'yyyy-mm-dd';

@Injectable()
export class SummaryService {
  constructor(
    private readonly sourceService: SourceService,
    private readonly blockService: BlockService,
    private readonly exchangeService: ExchangeService,
  ) {}

  async getSummary(
    userId: string,
    currency: string,
    date?: Date,
  ): Promise<Summary> {
    const sources = await this.sourceService.findSources(userId);
    const sourceIds = sources.map((source) => source.id);

    const blocks = (
      await Promise.all(
        sources.map((source) =>
          this.blockService.findBlocksBySourceId(userId, source.id),
        ),
      )
    )
      .flat()
      .filter(
        (block) => !date || new Date(block.date).getTime() <= date.getTime(),
      )
      .sort(
        (left, right) =>
          new Date(left.date).getTime() - new Date(right.date).getTime(),
      );

    const amountInUSD = this.getBlocksAmountInUSD(sourceIds, blocks);

    const amount = await this.exchangeService.convert(
      'USD',
      currency,
      amountInUSD,
    );

    return {
      amountInUSD,
      amount,
      currency,
    };
  }

  async getChart(userId, input: ChartInput): Promise<HistoryItem[]> {
    // get all sources (filtered) by user id
    // get all blocks (filtered) by user id
    // go through the list of blocks (grouped by days)
    // for each day count the total amountInUSD/dominance

    const allSources = await this.sourceService.findSources(userId);

    const sources = await this.getSourcesForChart(userId, {
      sourceId: input.sourceId,
      tags: input.tags,
    });

    const sourceIds = sources.map((source) => source.id);

    const blocks = (
      await Promise.all(
        allSources.map((source) =>
          this.blockService.findBlocksBySourceId(userId, source.id),
        ),
      )
    )
      .flat()
      .sort(
        (left, right) =>
          new Date(left.date).getTime() - new Date(right.date).getTime(),
      );

    const blocksGroupedByDays = _.groupBy(blocks, (block) =>
      format(new Date(block.date), DATE_FORMAT),
    );

    const sortedKeys = Object.keys(blocksGroupedByDays).sort();

    const blocksWithPreviousBlocksGroupedByDays = sortedKeys.reduce(
      (accumulator, key, index) => {
        const blocks = sortedKeys
          .slice(0, index + 1)
          .flatMap((k) => blocksGroupedByDays[k]);

        return { ...accumulator, [key]: blocks };
      },
      {} as { [key: string]: BlockEntity[] },
    );

    return sortedKeys.map((key) => {
      const date = parse(key, DATE_FORMAT, startOfDay(new Date()));

      switch (input.type) {
        case ChartType.AMOUNT_IN_USD:
          return {
            date,
            value: this.getBlocksAmountInUSD(
              sourceIds,
              blocksWithPreviousBlocksGroupedByDays[key],
            ),
          };
        case ChartType.DOMINANCE:
          return {
            date,
            value: this.getBlocksDominance(
              sourceIds,
              blocksWithPreviousBlocksGroupedByDays[key],
            ),
          };
      }
    });
  }

  private getBlocksAmountInUSD(
    sourceIds: string[],
    blocks: BlockEntity[],
  ): number {
    const blocksGroupedBySource = _.groupBy(blocks, 'sourceId');

    return sourceIds
      .map(
        (sourceId) =>
          blocksGroupedBySource[sourceId]?.sort(
            (left, right) =>
              new Date(left.date).getTime() - new Date(right.date).getTime(),
          )[0].amountInUSD,
      )
      .filter(Boolean)
      .reduce((accumulator, amountInUSD) => +accumulator + +amountInUSD, 0);
  }

  private getBlocksDominance(
    sourceIds: string[],
    blocks: BlockEntity[],
  ): number {
    const allBlocksGroupedBySource = _.groupBy(blocks, 'sourceId');
    const allSourceIds = Object.keys(allBlocksGroupedBySource);

    const totalAmountInUSD = allSourceIds
      .map(
        (sourceId) =>
          allBlocksGroupedBySource[sourceId].sort(
            (left, right) =>
              new Date(left.date).getTime() - new Date(right.date).getTime(),
          )[0].amountInUSD,
      )
      .reduce((accumulator, amountInUSD) => +accumulator + +amountInUSD, 0);

    const filteredAmountInUSD = sourceIds
      .map((sourceId) => {
        return allBlocksGroupedBySource[sourceId]?.sort(
          (left, right) =>
            new Date(left.date).getTime() - new Date(right.date).getTime(),
        )[0].amountInUSD;
      })
      .filter(Boolean)
      .reduce((accumulator, amountInUSD) => +accumulator + +amountInUSD, 0);

    return filteredAmountInUSD / totalAmountInUSD;
  }

  private async getSourcesForChart(
    userId: string,
    { sourceId, tags }: Pick<ChartInput, 'sourceId' | 'tags'>,
  ): Promise<SourceEntity[]> {
    if (sourceId)
      return [await this.sourceService.findSourceById(userId, sourceId)];

    return this.sourceService.findSources(userId, tags);
  }
}
