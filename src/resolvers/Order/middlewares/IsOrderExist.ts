import { MiddlewareFn, NextFn } from "type-graphql";
import { User } from "../../../entity/User";
import { Context } from "../../../types/Context";

export const IsOrderExist: MiddlewareFn<Context> = async (
  { context: { dbConnection, req }, args },
  next
): Promise<NextFn> => {
  const user = await dbConnection
    .getRepository(User)
    .createQueryBuilder("user")
    .innerJoin("user.orders", "orders")
    .where("user.email = :email", { email: req.user.email })
    .andWhere("orders.id = :id", { id: args.id })
    .getOne();

  if (!user) {
    throw new Error("INVALID_ORDER_ID");
  }

  return next();
};
