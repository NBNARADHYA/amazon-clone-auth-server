import { Max, Min } from "class-validator";
import { Field, InputType, Int } from "type-graphql";
import { Cart } from "../../../entity/Cart";
import { IsProductExist } from "./isProductExist";

@InputType()
export class UpdateCartInput implements Partial<Cart> {
  @Field()
  @IsProductExist({ message: "Invalid Product ID" })
  product: string;

  @Field(() => Int)
  @Min(0)
  @Max(5)
  nos: number;
}
