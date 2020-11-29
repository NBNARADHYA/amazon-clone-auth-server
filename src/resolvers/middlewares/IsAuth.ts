import { verify } from "jsonwebtoken";
import { MiddlewareFn, NextFn } from "type-graphql";
import { User } from "../../entity/User";
import { Payload } from "../../types/Payload";
import { Context } from "../../types/Context";
import { AuthenticationError } from "apollo-server-express";

export const IsAuth: MiddlewareFn<Context> = async (
  { context: { dbConnection, req } },
  next
): Promise<NextFn> => {
  if (!req.headers.authorization) {
    throw new AuthenticationError("Not authorized");
  }

  const authorization = req.headers.authorization.split(" ");
  if (authorization.length !== 2) {
    throw new AuthenticationError("Not authorized");
  }

  const token = authorization[1];

  try {
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!) as Payload;

    const user = await dbConnection
      .getRepository(User)
      .findOne({ where: { email: payload.email } });

    if (!user) {
      throw new AuthenticationError("Not authorized");
    }

    req.user = user;
  } catch (error) {
    throw new AuthenticationError("Not authorized");
  }

  return next();
};
