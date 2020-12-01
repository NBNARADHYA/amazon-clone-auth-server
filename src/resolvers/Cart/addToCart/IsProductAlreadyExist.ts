import { MiddlewareFn, NextFn } from "type-graphql";
import { Cart } from "../../../entity/Cart";
import { Context } from "../../../types/Context";

export const IsProductAlreadyExist: MiddlewareFn<Context> = async (
  {
    context: { dbConnection, req },
    args: {
      cart: { product },
    },
  },
  next
): Promise<NextFn> => {
  const cart = await dbConnection
    .getRepository(Cart)
    .findOne({ where: { email: req.user.email, product } });

  if (cart) {
    throw new Error("PRODUCT_ALREADY_EXISTS");
  }

  return next();
};
