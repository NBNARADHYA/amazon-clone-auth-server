import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Order } from "../../entity/Order";
import { User } from "../../entity/User";
import { Context } from "../Context";
import { IsAuth } from "../middlewares/IsAuth";

@Resolver()
export class CancelOrder {
  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth)
  async cancelOrder(
    @Arg("orderId") orderId: number,
    @Ctx() { dbConnection, req }: Context
  ): Promise<boolean> {
    const user = await dbConnection
      .getRepository(User)
      .createQueryBuilder("user")
      .innerJoin("user.orders", "orders")
      .where("user.email = :email", { email: req.user.email })
      .andWhere("orders.id = :orderId", { orderId })
      .getOne();

    if (!user) {
      throw new Error("INVALID_ORDER_ID");
    }

    await dbConnection.getRepository(Order).delete({ id: orderId });

    return true;
  }
}
