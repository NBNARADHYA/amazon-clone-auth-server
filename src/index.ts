import { config } from "dotenv";

const devEnvironment = config();
if (devEnvironment.error) {
  console.log(devEnvironment.error);
}

import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express, { Request, Response } from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { SignUp } from "./resolvers/User/SignUp";
import { Login } from "./resolvers/User/Login";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { Payload } from "./utils/Payload";
import { createAccessToken } from "./utils/createAccessToken";

(async () => {
  const dbConnection = await createConnection();

  const app = Express();
  app.use(cookieParser());

  app.post(
    "/refresh_token",
    async (req: Request, res: Response): Promise<Response> => {
      const token = req.cookies.jid;

      if (!token) {
        return res.send({ error: "TOKEN_REQUIRED", accessToken: null });
      }

      try {
        const payload = verify(
          token,
          process.env.REFRESH_TOKEN_SECRET!
        ) as Payload;

        const user = await dbConnection
          .getRepository(User)
          .findOne({ where: { email: payload.email } });

        if (!user) {
          return res.send({ error: "INVALID_USER", accessToken: null });
        }

        return res.send({
          error: null,
          accessToken: createAccessToken({
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
          } as Payload),
        });
      } catch (error) {
        return res.send({ error: "INVALID_TOKEN", accessToken: null });
      }
    }
  );

  const schema = await buildSchema({
    resolvers: [SignUp, Login],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, dbConnection }),
  });

  apolloServer.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () =>
    console.log(
      `Server started at http://localhost:${PORT}${apolloServer.graphqlPath}`
    )
  );
})();
