import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Cart } from "../../entity/Cart";
import { Context } from "../../types/Context";
import { ProductInput } from "../inputTypes/ProductInput";
import { IsAuth } from "../middlewares/IsAuth";
import { IsProductAlreadyExist } from "./addToCart/IsProductAlreadyExist";

@Resolver()
export class AddToCart {
  @Mutation(() => Cart)
  @UseMiddleware(IsAuth, IsProductAlreadyExist)
  async addToCart(
    @Arg("cart") { product, priceForOne, nos }: ProductInput,
    @Ctx() { req, dbConnection }: Context
  ): Promise<Cart> {
    const cart = new Cart();
    cart.email = req.user.email;
    cart.product = product;
    cart.priceForOne = priceForOne;
    cart.nos = nos;

    await dbConnection.getRepository(Cart).insert(cart);
    return cart;
  }
}
