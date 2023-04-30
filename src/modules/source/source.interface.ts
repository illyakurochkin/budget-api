import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateSourceInput {
  @Field(() => String)
  name: string;

  @Field(() => [String], { defaultValue: [], nullable: true})
  tags: string[];
}

@InputType()
export class UpdateSourceInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}

// @ObjectType()
// export class SourceDTO {
//   @Field(() => ID)
//   id: string;
//
//   @Field(() => String)
//   name: string;
//
//   @Field(() => )
// }
