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
import { Context } from "../Context";
import { IsAuth } from "../middlewares/IsAuth";

@Resolver(Order)
export class FetchOrders {
  @FieldResolver(() => [OrderContent], { name: "products" })
  async fetchOrderContents(
    @Root() { id }: Order,
    @Ctx() { dbConnection }: Context
  ): Promise<OrderContent[] | undefined> {
    const order = await dbConnection
      .getRepository(Order)
      .findOne({ where: { id }, relations: ["products"] });

    return order?.products;
  }

  @Query(() => [Order], { name: "orders" })
  @UseMiddleware(IsAuth)
  async fetchOrders(
    @Ctx() { dbConnection, req }: Context
  ): Promise<Order[] | undefined> {
    const user = await dbConnection
      .getRepository(User)
      .findOne({ where: { email: req.user.email }, relations: ["orders"] });

    return user?.orders;
  }
}