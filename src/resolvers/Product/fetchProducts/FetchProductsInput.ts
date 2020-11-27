import { Field, ArgsType, Int } from "type-graphql";

@ArgsType()
export class FetchProductsInput {
  @Field()
  category: string;

  @Field(() => Int, { nullable: true })
  order: number;

  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;
}
