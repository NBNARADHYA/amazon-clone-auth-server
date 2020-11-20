import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Order } from "../../entity/Order";
import { Context } from "../Context";
import { IsAuth } from "../middlewares/IsAuth";
import { IsOrderExist } from "./middlewares/IsOrderExist";

@Resolver()
export class CancelOrder {
  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth, IsOrderExist)
  async cancelOrder(
    @Arg("id") id: number,
    @Ctx() { dbConnection }: Context
  ): Promise<boolean> {
    await dbConnection.getRepository(Order).delete({ id });

    return true;
  }
}
