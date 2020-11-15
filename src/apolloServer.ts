import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Connection } from "typeorm";
import { resolvers } from "./resolvers";

export const createApolloServer = async (
  dbConnection: Connection
): Promise<ApolloServer> => {
  const schema = await buildSchema({
    resolvers,
  });

  return new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, dbConnection }),
  });
};
