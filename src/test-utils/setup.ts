import { Connection } from "typeorm";

if (process.env.NODE_ENV === "test") {
  const { config } = require("dotenv");
  const devEnvironment = config();
  if (devEnvironment.error) {
    console.error(devEnvironment.error);
  }
}

import { createTestConnection } from "./testConnection";

export const setUpTest = (): Promise<Connection> => createTestConnection();
