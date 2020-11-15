import { sign } from "jsonwebtoken";
import { Payload } from "./Payload";

export const createAccessToken = (payload: Payload): string =>
  sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "30m" });
