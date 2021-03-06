import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Cart } from "../../entity/Cart";
import { Context } from "../../types/Context";
import { IsAuth } from "../middlewares/IsAuth";
import { FetchCartOutput } from "./fetchCart/FetchCartOutput";

@Resolver()
export class FetchCart {
  @Query(() => [FetchCartOutput], { name: "cart" })
  @UseMiddleware(IsAuth)
  async fetchCart(@Ctx() { dbConnection, req }: Context): Promise<Array<Cart>> {
    return await dbConnection.getRepository(Cart).find({
      where: { email: req.user.email },
      relations: ["product"],
      select: ["product", "nos"],
    });
  }
}
