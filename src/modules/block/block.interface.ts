import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class CreateBlockInput {
  @Field(() => ID)
  sourceId: string;

  @Field(() => Number)
  amount: number;

  @Field(() => String)
  currency: string;
}
