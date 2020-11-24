import { verify } from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { Connection } from "typeorm";
import { makeGraphQLQuery } from "../../test-utils/graphQLQuery";
import { setUpTest } from "../../test-utils/setup";
import { signUpFakeUser } from "../../test-utils/user/fakeUser";
import faker from "faker";

let testDbConnection: Connection;

beforeAll(async () => {
  testDbConnection = await setUpTest();
});

afterAll(async () => {
  await testDbConnection.close();
});

describe("Test login mutation", () => {
  const loginMutation: string = `
        mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                email
                firstName
                lastName
                accessToken
            }
        } 
    `;

  it("Login with missing required fields", async () => {
    const result = await makeGraphQLQuery({
      source: loginMutation,
      variableValues: {
        email: faker.internet.email(),
      },
    });

    expect(result).toMatchObject({
      errors: expect.arrayContaining([expect.any(GraphQLError)]),
    });
  });

  it("Login with invalid email", async () => {
    const result = await makeGraphQLQuery({
      source: loginMutation,
      variableValues: {
        password: faker.internet.password(),
        email: faker.name.firstName(),
      },
    });

    expect(result).toMatchObject({
      errors: [
        expect.objectContaining({
          message: "Argument Validation Error",
          locations: expect.any(Array),
          path: ["login"],
        }),
      ],
    });
  });

  it("Login with non existant user", async () => {
    const result = await makeGraphQLQuery({
      source: loginMutation,
      variableValues: {
        password: faker.internet.password(),
        email: faker.internet.email(),
      },
      contextValue: {
        dbConnection: testDbConnection,
      },
    });

    expect(result).toMatchObject({
      errors: [
        expect.objectContaining({
          message: "INVALID_USER",
          locations: expect.any(Array),
          path: ["login"],
        }),
      ],
    });
  });

  it("Login with wrong password", async () => {
    const user = await signUpFakeUser(testDbConnection);

    const result = await makeGraphQLQuery({
      source: loginMutation,
      variableValues: {
        password: faker.internet.password(),
        email: user.email,
      },
      contextValue: {
        dbConnection: testDbConnection,
      },
    });

    expect(result).toMatchObject({
      errors: [
        expect.objectContaining({
          message: "INVALID_PASSWORD",
          locations: expect.any(Array),
          path: ["login"],
        }),
      ],
    });
  });

  it("Login with right credentials", async () => {
    const user = await signUpFakeUser(testDbConnection);

    const expressCokkieMock = jest.fn();

    const result = await makeGraphQLQuery({
      source: loginMutation,
      variableValues: {
        password: user.password,
        email: user.email,
      },
      contextValue: {
        dbConnection: testDbConnection,
        res: {
          cookie: expressCokkieMock,
        },
      },
    });

    const { password, ...rest } = user;

    expect(result).toMatchObject({
      data: {
        login: {
          ...rest,
          accessToken: expect.any(String),
        },
      },
    });

    const expressCokkieMockCalls = expressCokkieMock.mock.calls;
    expect(expressCokkieMockCalls.length).toBe(1);
    expect(expressCokkieMockCalls[0][0]).toBe("jid");
    expect(expressCokkieMockCalls[0][1]).toBeDefined();
    expect(expressCokkieMockCalls[0][2]).toMatchObject({
      httpOnly: true,
    });

    const accessToken: string = result.data!.login.accessToken;
    const refreshToken: string = expressCokkieMockCalls[0][1];

    expect(verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)).toMatchObject(
      rest
    );
    expect(
      verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
    ).toMatchObject(rest);
  });
});
