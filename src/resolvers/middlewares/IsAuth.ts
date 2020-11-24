import { verify } from "jsonwebtoken";
import { MiddlewareFn, NextFn } from "type-graphql";
import { User } from "../../entity/User";
import { Payload } from "../../types/Payload";
import { Context } from "../../types/Context";

export const IsAuth: MiddlewareFn<Context> = async (
  { context: { dbConnection, req } },
  next
): Promise<NextFn> => {
  if (!req.headers.authorization) {
    throw new Error("NOT_AUTHORIZED");
  }

  const authorization = req.headers.authorization.split(" ");
  if (authorization.length !== 2) {
    throw new Error("NOT_AUTHORIZED");
  }

  const token = authorization[1];

  try {
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!) as Payload;

    const user = await dbConnection
      .getRepository(User)
      .findOne({ where: { email: payload.email } });

    if (!user) {
      throw new Error("NOT_AUTHORIZED");
    }

    req.user = user;
  } catch (error) {
    throw new Error("NOT_AUTHORIZED");
  }

  return next();
};
