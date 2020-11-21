import DataLoader from "dataloader";
import { Request, Response } from "express";
import { Connection } from "typeorm";
import { OrderContent } from "../entity/OrderContent";

export interface Context {
  req: Request;
  res: Response;
  dbConnection: Connection;
  orderContentsLoader: DataLoader<number, OrderContent[], number>;
}
