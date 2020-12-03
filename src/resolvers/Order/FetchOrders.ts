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
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.orders", "orders")
      .where("user.email = :email", { email: req.user.email })
      .andWhere("orders.status = :status", { status: "PAID" })
      .getOne();

    if (!user) {
      return [];
    }

    return user.orders;
  }
}
