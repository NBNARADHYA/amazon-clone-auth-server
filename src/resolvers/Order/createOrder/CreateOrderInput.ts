import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { ProductInput } from "../../inputTypes/ProductInput";

@InputType()
export class CreateOrderInput {
  @Field(() => [ProductInput])
  products: ProductInput[];

  @Field(() => Boolean)
  checkout: boolean;

  @Field()
  address: string;

  @Field()
  country: string;

  @Field()
  state: string;

  @Field()
  @Length(6, 6)
  pincode: string;

  @Field()
  city: string;
}
