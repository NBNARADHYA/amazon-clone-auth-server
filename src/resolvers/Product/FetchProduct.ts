import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Product } from "../../entity/Product";
import { Context } from "../../types/Context";

@Resolver()
export class FetchProduct {
  @Query(() => Product, { name: "product" })
  async fetchProduct(
    @Arg("id") id: string,
    @Ctx() { dbConnection }: Context
  ): Promise<Product | undefined> {
    return await dbConnection.getRepository(Product).findOne({ where: { id } });
  }
}
