import { Request, Response } from "express";
import { Connection } from "typeorm";

export interface Context {
  req: Request;
  res: Response;
  dbConnection: Connection;
}
