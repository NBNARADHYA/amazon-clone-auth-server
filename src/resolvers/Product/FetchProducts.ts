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
    const orderBy = order === 1 ? "ASC" : order === -1 ? "DESC" : undefined;

    const [products, count] = await dbConnection
      .getRepository(Product)
      .createQueryBuilder("product")
      .where("product.category = :category", { category })
      .orderBy("cast(price as double precision)", orderBy)
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      count,
      products,
    };
  }
}
