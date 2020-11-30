import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Cart } from "../../entity/Cart";
import { Order } from "../../entity/Order";
import { OrderContent } from "../../entity/OrderContent";
import { Context } from "../../types/Context";
import { IsAuth } from "../middlewares/IsAuth";
import { CreateOrderInput } from "./createOrder/CreateOrderInput";

@Resolver()
export class CreateOrder {
  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth)
  async createOrder(
    @Arg("data")
    {
      products,
      checkout,
      address,
      country,
      pincode,
      state,
      city,
    }: CreateOrderInput,
    @Ctx() { dbConnection, req }: Context
  ): Promise<boolean> {
    const order = new Order();
    order.user = req.user;
    order.address = address;
    order.country = country;
    order.pincode = pincode;
    order.city = city;
    order.state = state;

    await dbConnection.getRepository(Order).insert(order);

    const orderContents = products.map(
      ({ product, nos, priceForOne }): OrderContent => {
        const newProduct = new OrderContent();
        newProduct.productId = product;
        newProduct.nos = nos;
        newProduct.priceForOne = priceForOne;
        newProduct.order = order;
        return newProduct;
      }
    );

    if (checkout) {
      await dbConnection.getRepository(Cart).delete({ email: req.user.email });
    }

    try {
      await dbConnection.getRepository(OrderContent).insert(orderContents);
    } catch (error) {
      throw new Error(error);
    }

    return true;
  }
}
