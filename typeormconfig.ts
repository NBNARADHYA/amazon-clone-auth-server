import { ConnectionOptions } from "typeorm";

let typeormConfig: ConnectionOptions = {
  type: "postgres",
  synchronize: true,
  logging: false,
  entities: ["./src/entity/*.*"],
};

if (process.env.NODE_ENV === "production") {
  typeormConfig = {
    ...typeormConfig,
    url: process.env.DATABASE_URL,
    extra: {
      ssl: { rejectUnauthorized: false },
    },
  };
} else {
  typeormConfig = {
    ...typeormConfig,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as number | undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: true,
  };
}

export { typeormConfig };
