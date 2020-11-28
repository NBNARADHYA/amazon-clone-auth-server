import { Field, ObjectType } from "type-graphql";
import { Product } from "../../../entity/Product";

@ObjectType()
export class FetchCartOutput {
  @Field(() => Product)
  product: Product;

  @Field()
  nos: number;
}
