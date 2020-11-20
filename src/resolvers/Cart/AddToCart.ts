import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Cart } from "../../entity/Cart";
import { Context } from "../Context";
import { ProductInput } from "../inputTypes/ProductInput";
import { IsAuth } from "../middlewares/IsAuth";
import { IsProductAlreadyExist } from "./addToCart/IsProductAlreadyExist";

@Resolver()
export class AddToCart {
  @Mutation(() => Cart)
  @UseMiddleware(IsAuth, IsProductAlreadyExist)
  async addToCart(
    @Arg("data") { productId, priceForOne, nos }: ProductInput,
    @Ctx() { req, dbConnection }: Context
  ): Promise<Cart> {
    const cart = new Cart();
    cart.email = req.user.email;
    cart.productId = productId;
    cart.priceForOne = priceForOne;
    cart.nos = nos;

    await dbConnection.getRepository(Cart).insert(cart);
    return cart;
  }
}
