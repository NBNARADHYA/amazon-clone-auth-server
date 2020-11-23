if (process.env.NODE_ENV !== "test") {
  process.exit(0);
}
import { config } from "dotenv";
import { Connection } from "typeorm";

const devEnvironment = config();
if (devEnvironment.error) {
  console.error(devEnvironment.error);
}

import { createTestConnection } from "./testConnection";

export const setUpTest = (): Promise<Connection> => createTestConnection();
