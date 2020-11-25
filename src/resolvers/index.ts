import { Login } from "./User/Login";
import { SignUp } from "./User/SignUp";
import { Logout } from "./User/Logout";
import { AddToCart } from "./Cart/AddToCart";
import { FetchCart } from "./Cart/FetchCart";
import { UpdateCart } from "./Cart/UpdateCart";
import { CreateOrder } from "./Order/CreateOrder";
import { FetchOrders } from "./Order/FetchOrders";
import { CancelOrder } from "./Order/CancelOrder";
import { UpdateOrder } from "./Order/UpdateOrder";
import { FetchProducts } from "./Product/FetchProducts";

export const resolvers: [Function, ...Function[]] = [
  Login,
  SignUp,
  Logout,
  AddToCart,
  FetchCart,
  UpdateCart,
  CreateOrder,
  FetchOrders,
  CancelOrder,
  UpdateOrder,
  FetchProducts,
];
