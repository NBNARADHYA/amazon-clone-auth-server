import DataLoader, { BatchLoadFn } from "dataloader";
import { getConnection } from "typeorm";
import { Order } from "../entity/Order";
import { OrderContent } from "../entity/OrderContent";

const orderContentsBatchLoadFunction: BatchLoadFn<
  number,
  OrderContent[]
> = async function (ids) {
  const dbConnection = getConnection();

  const orders = await dbConnection
    .getRepository(Order)
    .findByIds(ids as number[], { relations: ["products"] });

  const orderContentsMap: { [key: number]: OrderContent[] } = {};

  orders.forEach((order) => {
    orderContentsMap[order.id] = order.products;
  });

  return ids.map((id): OrderContent[] => orderContentsMap[id]);
};

export const orderContentsLoader = (): DataLoader<
  number,
  OrderContent[],
  number
> => new DataLoader(orderContentsBatchLoadFunction);
