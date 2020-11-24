import { graphql, GraphQLArgs, GraphQLSchema, Source } from "graphql";
import { buildGraphQLSchema } from "../utils/buildGqlSchema";

interface Props extends Partial<GraphQLArgs> {
  source: string | Source;
}

let schema: GraphQLSchema;

export const makeGraphQLQuery = async (args: Props) => {
  if (!schema) {
    schema = await buildGraphQLSchema();
  }
  return graphql({
    ...args,
    schema,
  });
};
