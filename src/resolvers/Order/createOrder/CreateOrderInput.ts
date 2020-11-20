import { Field, ArgsType } from "type-graphql";
import { ProductInput } from "../../inputTypes/ProductInput";

@ArgsType()
export class CreateOrderInput {
  @Field(() => [ProductInput])
  products: ProductInput[];
}
