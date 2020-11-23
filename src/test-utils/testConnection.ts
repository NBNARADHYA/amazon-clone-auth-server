import { Connection, ConnectionOptions, createConnection } from "typeorm";

export const createTestConnection = (): Promise<Connection> => {
  return createConnection({
    type: "postgres",
    host: process.env.DB_HOST_TEST,
    port: process.env.DB_PORT_TEST as number | undefined,
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASS_TEST,
    database: process.env.DB_NAME_TEST,
    synchronize: process.env.NODE_ENV === "test",
    dropSchema: process.env.NODE_ENV === "test",
    entities: ["./src/entity/*.*"],
  } as ConnectionOptions);
};
