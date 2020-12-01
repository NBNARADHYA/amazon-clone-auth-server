import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Cart } from "../../entity/Cart";
import { Order } from "../../entity/Order";
import { OrderContent } from "../../entity/OrderContent";
import { Context } from "../../types/Context";
import { IsAuth } from "../middlewares/IsAuth";
import { CreateOrderInput } from "./createOrder/CreateOrderInput";
import { CreateOrderOutput } from "./createOrder/CreateOrderOutput";

@Resolver()
export class CreateOrder {
  @Mutation(() => CreateOrderOutput)
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
  ): Promise<CreateOrderOutput> {
    const order = new Order();
    order.user = req.user;
    order.address = address;
    order.country = country;
    order.pincode = pincode;
    order.city = city;
    order.state = state;

    const result = await dbConnection.getRepository(Order).insert(order);

    const orderContents = products.map(
      ({ product, nos }): OrderContent => {
        const newProduct = new OrderContent();
        newProduct.product = product;
        newProduct.nos = nos;
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

    return result.raw[0];
  }
}
