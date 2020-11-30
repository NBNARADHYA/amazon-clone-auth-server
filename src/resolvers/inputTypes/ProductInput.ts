import { Min, Max } from "class-validator";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class ProductInput {
  @Field()
  product: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @Min(1)
  @Max(5)
  nos: number;

  @Field()
  priceForOne: string;
}
