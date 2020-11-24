import { Args, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Order } from "../../entity/Order";
import { OrderContent } from "../../entity/OrderContent";
import { Context } from "../../types/Context";
import { IsAuth } from "../middlewares/IsAuth";
import { CreateOrderInput } from "./createOrder/CreateOrderInput";

@Resolver()
export class CreateOrder {
  @Mutation(() => [OrderContent])
  @UseMiddleware(IsAuth)
  async createOrder(
    @Args() { products }: CreateOrderInput,
    @Ctx() { dbConnection, req }: Context
  ): Promise<OrderContent[]> {
    const order = new Order();
    order.user = req.user;

    await dbConnection.getRepository(Order).insert(order);

    const orderContents = products.map(
      (product): OrderContent => {
        const newProduct = new OrderContent();
        newProduct.productId = product.productId;
        newProduct.nos = product.nos;
        newProduct.priceForOne = product.priceForOne;
        newProduct.order = order;
        return newProduct;
      }
    );

    try {
      await dbConnection.getRepository(OrderContent).insert(orderContents);
    } catch (error) {
      throw new Error(error);
    }

    return orderContents;
  }
}
