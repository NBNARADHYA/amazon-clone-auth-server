import { MiddlewareFn, NextFn } from "type-graphql";
import { Order } from "../../../entity/Order";
import { Context } from "../../../types/Context";
import { UpdateOrderArgsType } from "./UpdateOrderArgs";

export const IsProductExist: MiddlewareFn<Context> = async (
  { context: { dbConnection, req }, args },
  next
): Promise<NextFn> => {
  const { product, id } = args as UpdateOrderArgsType;

  const order = await dbConnection
    .getRepository(Order)
    .createQueryBuilder("order")
    .innerJoinAndSelect("order.products", "products")
    .where("order.id = :id", { id })
    .andWhere("products.productId = :product", { product })
    .getOne();

  if (!order) {
    throw new Error("Invalid product ID");
  }
  req.orderProductId = order.products[0].id;

  return next();
};
