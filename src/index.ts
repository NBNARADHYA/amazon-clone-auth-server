import { config } from "dotenv";
const devEnvironment = config();
if (devEnvironment.error) {
  console.log(devEnvironment.error);
}

import "reflect-metadata";
import Express from "express";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { createApolloServer } from "./apolloServer";
import { refreshTokenRouter } from "./routers/refreshToken";

(async () => {
  const dbConnection = await createConnection();

  const app = Express();

  app.use(cookieParser());
  app.use("/refresh_token", refreshTokenRouter);

  const apolloServer = await createApolloServer(dbConnection);

  apolloServer.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () =>
    console.log(
      `Server started at http://localhost:${PORT}${apolloServer.graphqlPath}`
    )
  );
})();
