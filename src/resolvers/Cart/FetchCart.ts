import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Cart } from "../../entity/Cart";
import { Context } from "../Context";
import { IsAuth } from "../middlewares/IsAuth";

@Resolver()
export class FetchCart {
  @Query(() => [Cart], { name: "cart" })
  @UseMiddleware(IsAuth)
  async fetchCart(@Ctx() { dbConnection, req }: Context): Promise<Array<Cart>> {
    return await dbConnection
      .getRepository(Cart)
      .find({ where: { email: req.user.email } });
  }
}
