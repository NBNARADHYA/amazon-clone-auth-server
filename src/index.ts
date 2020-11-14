import { config } from "dotenv";

const devEnvironment = config();
if (devEnvironment.error) {
  console.log(devEnvironment.error);
}

import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { SignUp } from "./resolvers/User/SignUp";

(async () => {
  const dbConnection = await createConnection();

  const schema = await buildSchema({
    resolvers: [SignUp],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, dbConnection }),
  });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () =>
    console.log(
      `Server started at http://localhost:${PORT}${apolloServer.graphqlPath}`
    )
  );
})();
