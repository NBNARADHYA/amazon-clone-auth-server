if (process.env.NODE_ENV === "development") {
  const { config } = require("dotenv");
  const devEnvironment = config();
  if (devEnvironment.error) {
    console.error(devEnvironment.error);
  }
}

import "reflect-metadata";
import Express from "express";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { createApolloServer } from "./utils/apolloServer";
import { refreshTokenRouter } from "./routers/refreshToken";
import { typeormConfig } from "../typeormconfig";
import cors from "cors";
import { stripeWebHookRouter } from "./routers/stripeWebHook";

(async () => {
  try {
    const dbConnection = await createConnection(typeormConfig);

    const app = Express();

    app.use(
      cors({
        credentials: true,
        origin: `${process.env.CLIENT_HOST}`,
      })
    );
    app.use(cookieParser());
    app.use("/refresh_token", refreshTokenRouter);
    app.use("/stripe", stripeWebHookRouter);

    const apolloServer = await createApolloServer(dbConnection);

    apolloServer.applyMiddleware({ app, cors: false });

    const PORT = process.env.PORT || 5000;

    app.listen(
      PORT,
      () =>
        process.env.NODE_ENV === "development" &&
        console.log(
          `Server started at http://localhost:${PORT}${apolloServer.graphqlPath}`
        )
    );
  } catch (error) {
    throw new Error(error);
  }
})();
