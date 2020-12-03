import { Field, InputType } from "type-graphql";
import { ProductInput } from "../../inputTypes/ProductInput";

@InputType()
export class CreateOrderInput {
  @Field(() => [ProductInput])
  products: ProductInput[];

  @Field(() => Boolean)
  checkout: boolean;
}
