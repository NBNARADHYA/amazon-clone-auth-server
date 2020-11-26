import { Field, Int, ObjectType } from "type-graphql";
import { Product } from "../../../entity/Product";

@ObjectType()
export class FetchProductsOutput {
  @Field(() => [Product])
  products: Product[];

  @Field(() => Int)
  count: number;
}
