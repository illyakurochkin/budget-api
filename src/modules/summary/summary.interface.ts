import {
  Field, ID,
  InputType,
  ObjectType,
  registerEnumType
} from "@nestjs/graphql";

@ObjectType()
export class HistoryItem {
  @Field(() => Date)
  date: Date;

  @Field(() => Number)
  value: number;
}

@ObjectType()
export class Summary {
  @Field(() => Number)
  amountInUSD: number;

  @Field(() => Number)
  amount: number;

  @Field(() => String)
  currency: string;
}

export enum ChartType {
  AMOUNT_IN_USD = 'amountInUSD',
  DOMINANCE = 'dominance',
}

registerEnumType(ChartType, { name: 'ChartType' });

@InputType()
export class ChartInput {
  @Field(() => ChartType, {
    nullable: true,
    defaultValue: ChartType.AMOUNT_IN_USD,
  })
  type: ChartType;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  tags?: string[];

  @Field(() => ID, { nullable: true })
  sourceId?: string;
}
