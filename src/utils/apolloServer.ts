import { ApolloServer } from "apollo-server-express";
import { Connection } from "typeorm";
import { orderContentsLoader } from "../loaders/orderContentsLoader";
import { Context } from "../types/Context";
import { buildGraphQLSchema } from "./buildGqlSchema";

export const createApolloServer = async (
  dbConnection: Connection
): Promise<ApolloServer> => {
  const schema = await buildGraphQLSchema();

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
