import { Login } from "./User/Login";
import { SignUp } from "./User/SignUp";
import { Logout } from "./User/Logout";
import { AddToCart } from "./Cart/AddToCart";
import { FetchCart } from "./Cart/FetchCart";
import { UpdateCart } from "./Cart/UpdateCart";

export const resolvers: [Function, ...Function[]] = [
  Login,
  SignUp,
  Logout,
  AddToCart,
  FetchCart,
  UpdateCart,
];
