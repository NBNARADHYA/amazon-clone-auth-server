import { Field, InputType, Int } from "type-graphql";
import { Cart } from "../../../entity/Cart";

@InputType()
export class AddToCartInput implements Partial<Cart> {
  @Field()
  productId: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  nos: number;

  @Field(() => Int)
  priceForOne: number;
}
