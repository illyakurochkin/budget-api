import { SummaryService } from './summary.service';
import { SourceService } from '../source/source.service';
import { BlockService } from '../block/block.service';
import { ExchangeService } from '../exchange/exchange.service';

describe('summary service', () => {
  it('should return a Summary object with amountInUSD, amount, and currency fields', async () => {
    // Arrange
    const userId = '123456789';
    const currency = 'BTC';
    const date = new Date();
    const expectedSummary = {
      amountInUSD: 35000,
      amount: 1,
      currency: 'BTC',
    };

    const sourceServiceMock: Partial<SourceService> = {
      findSources: jest.fn().mockResolvedValue([]),
    };

    const blockServiceMock: Partial<BlockService> = {
      findBlocksBySourceId: jest.fn().mockResolvedValue([]),
    };

    const exchangeServiceMock: Partial<ExchangeService> = {
      convert: jest.fn().mockResolvedValue(35000),
    };

    const summaryService = new SummaryService(
      sourceServiceMock as SourceService,
      blockServiceMock as BlockService,
      exchangeServiceMock as ExchangeService,
    );

    // Act
    const summary = await summaryService.getSummary(userId, currency, date);

    // Assert
    expect(summary).toEqual(expectedSummary);
  });
});
