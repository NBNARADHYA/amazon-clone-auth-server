import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Cart } from "../../entity/Cart";
import { Context } from "../../types/Context";
import { IsAuth } from "../middlewares/IsAuth";
import { UpdateCartInput } from "./updateCart/UpdateCartInput";

@Resolver()
export class UpdateCart {
  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth)
  async updateCart(
    @Arg("cart") { product, nos }: UpdateCartInput,
    @Ctx() { dbConnection, req }: Context
  ): Promise<boolean> {
    if (nos) {
      await dbConnection
        .getRepository(Cart)
        .update({ email: req.user.email, product }, { nos });
    } else {
      await dbConnection
        .getRepository(Cart)
        .delete({ email: req.user.email, product });
    }

    return true;
  }
}
