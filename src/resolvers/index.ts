import { Login } from "./User/Login";
import { SignUp } from "./User/SignUp";

export const resolvers:
  | readonly [Function, ...Function[]]
  | [Function, ...Function[]]
  | readonly [string, ...string[]]
  | [string, ...string[]] = [Login, SignUp];
