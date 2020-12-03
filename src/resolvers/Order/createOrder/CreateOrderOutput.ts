import { Field, Float, Int, ObjectType } from "type-graphql";

@ObjectType()
export class CreateOrderOutput {
  @Field(() => Int)
  id: number;

  @Field(() => Float)
  createdAt: number;

  @Field()
  stripeId: string;
}
