import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const ALLOWED_CURRENCIES = [
  'USD',
  'PLN',
  'UAH',
  'EUR',
  'GBP',
  'BTC',
  'ETH',
  'XMR',
  'BNB',
  'SOL',
  'MATIC',
];

const mapCurrency = (currency: string) => {
  if (currency === 'USD') return 'USDC';
  return currency;
};

const isValidCurrency = (currency: string) =>
  ALLOWED_CURRENCIES.includes(currency);

@Injectable()
export class ExchangeService {
  constructor(private readonly configService: ConfigService) {}

  async convert(
    sourceCurrency: string,
    destinationCurrency: string,
    amount: number,
  ): Promise<number> {
    if (!isValidCurrency(sourceCurrency)) {
      throw new Error(`source currency "${sourceCurrency}" is not supported`);
    }

    if (!isValidCurrency(destinationCurrency)) {
      throw new Error(
        `destination currency "${destinationCurrency}" is not supported`,
      );
    }

    const apiKey = this.configService.get('exchange');

    if (!apiKey) throw new Error('no exchange api key provided');

    const { data } = await axios.get(
      `https://api.freecryptoapi.com/v1/getConversion?from=${mapCurrency(
        sourceCurrency,
      )}&to=${mapCurrency(
        destinationCurrency,
      )}&amount=${amount}&token=${apiKey}`,
      {
        headers: { authorization: `Bearer ${apiKey}` },
      },
    );

    console.log('data', data);

    if (data.status !== 'success') throw new Error('exchange failed');

    return data.result;
  }
}
