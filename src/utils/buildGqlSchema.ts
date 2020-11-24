import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { resolvers } from "../resolvers";

export const buildGraphQLSchema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: resolvers,
  });
};
