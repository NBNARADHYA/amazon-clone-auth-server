import { Args, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { OrderContent } from "../../entity/OrderContent";
import { Context } from "../../types/Context";
import { IsAuth } from "../middlewares/IsAuth";
import { IsOrderExist } from "./middlewares/IsOrderExist";
import { IsProductExist } from "./updateOrder/IsProductExist";
import { UpdateOrderArgsType } from "./updateOrder/UpdateOrderArgs";

@Resolver()
export class UpdateOrder {
  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth, IsOrderExist, IsProductExist)
  async updateOrder(
    @Args() { nos }: UpdateOrderArgsType,
    @Ctx() { req, dbConnection }: Context
  ): Promise<boolean> {
    const orderContentRepo = dbConnection.getRepository(OrderContent);

    if (nos === 0) {
      await orderContentRepo.delete({ id: req.orderProductId });
    } else {
      await orderContentRepo.update({ id: req.orderProductId }, { nos });
    }

    return true;
  }
}
