import { Cart } from "../../entity/Cart";
import faker from "faker";
import { Connection } from "typeorm";
import { makeGraphQLQuery } from "../graphQLQuery";

export interface FakeCart extends Partial<Cart> {}

export const generateFakeCart = (): FakeCart => ({
  productId: faker.commerce.product(),
  nos: faker.random.number({ min: 1, max: 5 }),
  priceForOne: faker.random.number(),
});

const addToCartMutation: string = `
        mutation AddToCart($cart: ProductInput!) {
            addToCart(cart: $cart) {
            id
            email
            productId
            nos
            priceForOne
            }
        }
    `;

export const addToCartFake = async (
  dbConnection: Connection,
  accessToken: string
): Promise<FakeCart> => {
  const cart = generateFakeCart();

  await makeGraphQLQuery({
    source: addToCartMutation,
    contextValue: {
      dbConnection,
      req: {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    },
    variableValues: {
      cart,
    },
  });

  return cart;
};
