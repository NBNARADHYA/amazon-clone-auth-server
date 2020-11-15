import { Login } from "./User/Login";
import { SignUp } from "./User/SignUp";
import { AddToCart } from "./Cart/AddToCart";
import { FetchCart } from "./Cart/FetchCart";
import { Logout } from "./User/Logout";

export const resolvers:
  | readonly [Function, ...Function[]]
  | [Function, ...Function[]]
  | readonly [string, ...string[]]
  | [string, ...string[]] = [Login, SignUp, AddToCart, FetchCart, Logout];
