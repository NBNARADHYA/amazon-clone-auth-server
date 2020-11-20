import { Min, Max } from "class-validator";
import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class UpdateOrderArgsType {
  @Field()
  id: number;

  @Field(() => Int)
  @Min(0)
  @Max(5)
  nos: number;

  @Field()
  productId: string;
}
