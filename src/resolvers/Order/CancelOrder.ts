import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Order } from "../../entity/Order";
import { Context } from "../../types/Context";
import { IsAuth } from "../middlewares/IsAuth";
import { IsOrderExist } from "./middlewares/IsOrderExist";

@Resolver()
export class CancelOrder {
  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth, IsOrderExist)
  async cancelOrder(
    @Arg("id", () => Int)
    id: number,
    @Ctx() { dbConnection }: Context
  ): Promise<boolean> {
    await dbConnection.getRepository(Order).delete({ id });

    return true;
  }
}
