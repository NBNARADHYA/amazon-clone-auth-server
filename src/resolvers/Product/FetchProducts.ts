import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Product } from "../../entity/Product";
import { Context } from "../../types/Context";

@Resolver()
export class FetchProducts {
  @Query(() => [Product], { name: "products" })
  async fetchProducts(
    @Arg("category") category: string,
    @Ctx() { dbConnection }: Context
  ): Promise<Product[]> {
    return await dbConnection
      .getRepository(Product)
      .find({ where: { category } });
  }
}
