import {
  Ctx,
  FieldResolver,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Order } from "../../entity/Order";
import { OrderContent } from "../../entity/OrderContent";
import { User } from "../../entity/User";
import { Context } from "../../types/Context";
import { IsAuth } from "../middlewares/IsAuth";

@Resolver(Order)
export class FetchOrders {
  @FieldResolver(() => [OrderContent], { name: "products" })
  async fetchOrderContents(
    @Root() { id }: Order,
    @Ctx() { orderContentsLoader }: Context
  ): Promise<OrderContent[]> {
    return await orderContentsLoader.load(id);
  }

  @Query(() => [Order], { name: "orders" })
  @UseMiddleware(IsAuth)
  async fetchOrders(@Ctx() { dbConnection, req }: Context): Promise<Order[]> {
    const user = await dbConnection
      .getRepository(User)
      .findOne({ where: { email: req.user.email }, relations: ["orders"] });

    return user!.orders;
  }
}
