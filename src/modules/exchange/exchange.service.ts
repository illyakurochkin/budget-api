import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  CRYPTO_CURRENCIES,
  FIAT_CURRENCIES,
  SUPPORTED_CURRENCIES,
} from '../../config/currencies';

const mapCurrency = (currency: string) => {
  if (currency === 'USD') return 'USDC';
  return currency;
};

const isValidCurrency = (currency: string) =>
  SUPPORTED_CURRENCIES.includes(currency);

@Injectable()
export class ExchangeService {
  constructor(private readonly configService: ConfigService) {}

  async convert(
    sourceCurrency: string,
    destinationCurrency: string, // always USD
    amount: number,
  ): Promise<number> {
    if (!SUPPORTED_CURRENCIES.includes(sourceCurrency)) {
      throw new Error(`source currency "${sourceCurrency}" is not supported`);
    }

    if (!SUPPORTED_CURRENCIES.includes(destinationCurrency)) {
      throw new Error(
        `destination currency "${destinationCurrency}" is not supported`,
      );
    }

    const apiKey = this.configService.get('exchange');

    if (!apiKey) throw new Error('no exchange api key provided');

    if (sourceCurrency === 'USD') return amount;

    try {
      if (FIAT_CURRENCIES.includes(sourceCurrency)) {
        const { data } = await axios.post(
          'http://api.livecoinwatch.com/coins/map',
          {
            currency: sourceCurrency,
            codes: ['USDT'],
            sort: 'rank',
            order: 'ascending',
            offset: 0,
            limit: 0,
            meta: true,
          },
          { headers: { Authorization: `Bearer ${apiKey}` } },
        );

        return amount / data.rate;
      }

      if (CRYPTO_CURRENCIES.includes(sourceCurrency)) {
        const { data } = await axios.post(
          'https://api.livecoinwatch.com/coins/single',
          {
            currency: 'USD',
            codes: [sourceCurrency],
            sort: 'rank',
            order: 'ascending',
            offset: 0,
            limit: 0,
            meta: true,
          },
          { headers: { Authorization: `Bearer ${apiKey}` } },
        );

        return amount * data.rate;
      }
    } catch (e) {
      console.log("e", e.response.data);
    }
  }
}

@Injectable()
export class ExchangeServiceDeprecated {
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

    console.log('fromCurrency', sourceCurrency);
    console.log('destinationCurrency', destinationCurrency);
    const token = `https://api.freecryptoapi.com/v1/getConversion?from=${mapCurrency(
      sourceCurrency,
    )}&to=${mapCurrency(destinationCurrency)}&amount=${amount}&token=${apiKey}`;
    console.log('token', token);

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
