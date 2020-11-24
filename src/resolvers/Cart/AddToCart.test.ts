import { Connection } from "typeorm";
import { makeGraphQLQuery } from "../../test-utils/graphQLQuery";
import { setUpTest } from "../../test-utils/setup";
import { ProductInput } from "../inputTypes/ProductInput";
import faker from "faker";
import { GraphQLError } from "graphql";
import {
  addToCartFake,
  generateFakeCart,
} from "../../test-utils/cart/fakeCart";
import { loginFakeUser, signUpFakeUser } from "../../test-utils/user/fakeUser";

let testDbConnection: Connection;

beforeAll(async () => {
  testDbConnection = await setUpTest();
});

afterAll(async () => {
  await testDbConnection.close();
});

describe("Test addToCart mutation", () => {
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

  it("addToCart with missing required fields", async () => {
    const result = await makeGraphQLQuery({
      source: addToCartMutation,
      variableValues: {
        cart: {
          productId: faker.commerce.product(),
          nos: faker.random.number({ min: 1, max: 5 }),
        } as ProductInput,
      },
    });
    expect(result).toMatchObject({
      errors: expect.arrayContaining([expect.any(GraphQLError)]),
    });
  });

  it("addToCart with invalid nos", async () => {
    const result = await makeGraphQLQuery({
      source: addToCartMutation,
      variableValues: {
        cart: {
          productId: faker.commerce.product(),
          priceForOne: faker.random.number(),
          nos: faker.random.number({ min: 10, max: 20 }),
        } as ProductInput,
      },
    });
    expect(result).toMatchObject({
      errors: expect.arrayContaining([expect.any(GraphQLError)]),
    });
  });

  it("addToCart without authorization", async () => {
    const cart = generateFakeCart();
    const result = await makeGraphQLQuery({
      source: addToCartMutation,
      contextValue: {
        dbConnection: testDbConnection,
        req: {
          headers: {},
        },
      },
      variableValues: {
        cart,
      },
    });
    expect(result).toMatchObject({
      errors: [
        expect.objectContaining({
          message: "NOT_AUTHORIZED",
          locations: expect.any(Array),
          path: ["addToCart"],
        }),
      ],
    });
  });

  it("addToCart with invalid authorization", async () => {
    const cart = generateFakeCart();
    const result = await makeGraphQLQuery({
      source: addToCartMutation,
      contextValue: {
        dbConnection: testDbConnection,
        req: {
          headers: {
            authorization: `Bearer ${faker.random.uuid()}`,
          },
        },
      },
      variableValues: {
        cart,
      },
    });
    expect(result).toMatchObject({
      errors: [
        expect.objectContaining({
          message: "NOT_AUTHORIZED",
          locations: expect.any(Array),
          path: ["addToCart"],
        }),
      ],
    });
  });

  it("addToCart with already existing product", async () => {
    const user = await signUpFakeUser(testDbConnection);
    const accessToken = await loginFakeUser(testDbConnection, user);

    const cart = await addToCartFake(testDbConnection, accessToken);
    const result = await makeGraphQLQuery({
      source: addToCartMutation,
      contextValue: {
        dbConnection: testDbConnection,
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
    expect(result).toMatchObject({
      errors: [
        expect.objectContaining({
          message: "PRODUCT_ALREADY_EXISTS",
          locations: expect.any(Array),
          path: ["addToCart"],
        }),
      ],
    });
  });

  it("addToCart with all valid fields", async () => {
    const user = await signUpFakeUser(testDbConnection);
    const accessToken = await loginFakeUser(testDbConnection, user);

    const cart = generateFakeCart();

    const result = await makeGraphQLQuery({
      source: addToCartMutation,
      contextValue: {
        dbConnection: testDbConnection,
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
    expect(result).toMatchObject({
      data: {
        addToCart: {
          id: expect.any(String),
          email: user.email,
          ...cart,
        },
      },
    });
  });
});
