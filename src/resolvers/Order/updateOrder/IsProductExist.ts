import { MiddlewareFn, NextFn } from "type-graphql";
import { Order } from "../../../entity/Order";
import { Context } from "../../Context";
import { UpdateOrderArgsType } from "./UpdateOrderArgs";

export const IsProductExist: MiddlewareFn<Context> = async (
  { context: { dbConnection, req }, args },
  next
): Promise<NextFn> => {
  const { productId, id } = args as UpdateOrderArgsType;

  const order = await dbConnection
    .getRepository(Order)
    .createQueryBuilder("order")
    .innerJoinAndSelect("order.products", "products")
    .where("order.id = :id", { id })
    .andWhere("products.productId = :productId", { productId })
    .getOne();

  if (!order) {
    throw new Error("INVALID_PRODUCT_ID");
  }
  req.orderProductId = order.products[0].id;

  return next();
};
