import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { SUPPORTED_CURRENCIES } from '../../config/currencies';

@InputType()
export class CreateBlockInput {
  @Field(() => ID)
  sourceId: string;

  @Field(() => Number)
  amount: number;

  @Field(() => String)
  @IsEnum(SUPPORTED_CURRENCIES, {
    message: `Unsupported currency. Supported currencies: ${SUPPORTED_CURRENCIES.join(
      ', ',
    )}.`,
  })
  currency: string;
}
