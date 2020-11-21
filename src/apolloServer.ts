import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Connection } from "typeorm";
import { orderContentsLoader } from "./loaders/orderContentsLoader";
import { Context } from "./resolvers/Context";

export const createApolloServer = async (
  dbConnection: Connection
): Promise<ApolloServer> => {
  const schema = await buildSchema({
    resolvers: [__dirname + "/resolvers/*/*.ts"],
  });

  return new ApolloServer({
    schema,
    context: ({ req, res }): Context => ({
      req,
      res,
      dbConnection,
      orderContentsLoader: orderContentsLoader(),
    }),
  });
};
