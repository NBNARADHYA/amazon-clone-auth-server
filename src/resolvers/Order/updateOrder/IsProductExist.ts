import { MiddlewareFn, NextFn } from "type-graphql";
import { Order } from "../../../entity/Order";
import { Context } from "../../Context";
import { UpdateOrderInput } from "./UpdateOrderInput";

export const IsProductExist: MiddlewareFn<Context> = async (
  { context: { dbConnection, req }, args },
  next
): Promise<NextFn> => {
  const { productId, id } = args as UpdateOrderInput;

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
  console.log(order);
  req.orderProductId = order.products[0].id;

  return next();
};
