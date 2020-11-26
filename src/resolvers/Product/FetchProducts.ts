import { Args, Ctx, Query, Resolver } from "type-graphql";
import { Product } from "../../entity/Product";
import { Context } from "../../types/Context";
import { FetchProductsInput } from "./fetchProducts/FetchProductsInput";
import { FetchProductsOutput } from "./fetchProducts/FetchProductsOutput";

@Resolver()
export class FetchProducts {
  @Query(() => FetchProductsOutput, { name: "products" })
  async fetchProducts(
    @Args() { category, order, skip, take }: FetchProductsInput,
    @Ctx() { dbConnection }: Context
  ): Promise<FetchProductsOutput> {
    const [products, count] = await dbConnection
      .getRepository(Product)
      .findAndCount({
        where: { category },
        skip,
        take,
        order: { price: order },
      });

    return {
      count,
      products,
    };
  }
}
