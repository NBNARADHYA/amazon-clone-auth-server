import { User } from "../../../entity/User";
import { MiddlewareFn } from "type-graphql";
import { Context } from "../../Context";

export const isEmailAlreadyExist: MiddlewareFn<Context> = async (
  { args: { email }, context: { dbConnection } },
  next
) => {
  const user = await dbConnection.manager.findOne(User, email);

  if (user) {
    throw new Error("EMAIL_ALREADY_IN_USE");
  }

  return next();
};
