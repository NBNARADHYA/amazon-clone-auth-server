import { User } from "../../../entity/User";
import { Context } from "src/resolvers/Context";
import { MiddlewareFn } from "type-graphql";

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
