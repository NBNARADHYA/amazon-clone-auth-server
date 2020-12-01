import { compare } from "bcryptjs";
import { GraphQLError } from "graphql";
import { Connection } from "typeorm";
import { User } from "../../entity/User";
import { makeGraphQLQuery } from "../../test-utils/graphQLQuery";
import { setUpTest } from "../../test-utils/setup";
import faker from "faker";
import {
  generateFakeUser,
  signUpFakeUser,
} from "../../test-utils/user/fakeUser";

let testDbConnection: Connection;

beforeAll(async () => {
  testDbConnection = await setUpTest();
});

afterAll(async () => {
  await testDbConnection.close();
});

describe("Test signUp mutation", () => {
  const signUpMutation: string = `
    mutation SignUp($user: SignUpInputType!) {
      signUp(user: $user) {
        id
        email
        firstName
        lastName
      }
    }
  `;
  it("SignUp with missing required fields", async () => {
    const result = await makeGraphQLQuery({
      source: signUpMutation,
      variableValues: {
        user: {
          password: faker.internet.password(),
          firstName: faker.name.firstName(),
        },
      },
      contextValue: {
        dbConnection: testDbConnection,
      },
    });
    expect(result).toMatchObject({
      errors: expect.arrayContaining([expect.any(GraphQLError)]),
    });
  });

  it("SignUp with invalid email", async () => {
    const result = await makeGraphQLQuery({
      source: signUpMutation,
      variableValues: {
        user: {
          password: faker.internet.password(),
          email: "asidfn",
          firstName: faker.name.firstName(),
        },
      },
      contextValue: {
        dbConnection: testDbConnection,
      },
    });
    expect(result).toMatchObject({
      errors: [
        expect.objectContaining({
          message: "Argument Validation Error",
          locations: expect.any(Array),
          path: ["signUp"],
        }),
      ],
    });
  });

  it("SignUp with invalid password", async () => {
    const result = await makeGraphQLQuery({
      source: signUpMutation,
      variableValues: {
        user: {
          password: "adf",
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
        },
      },
      contextValue: {
        dbConnection: testDbConnection,
      },
    });
    expect(result).toMatchObject({
      errors: [
        expect.objectContaining({
          message: "Argument Validation Error",
          locations: expect.any(Array),
          path: ["signUp"],
        }),
      ],
    });
  });

  it("SignUp with an existing email", async () => {
    const user = await signUpFakeUser(testDbConnection);

    const result = await makeGraphQLQuery({
      source: signUpMutation,
      variableValues: {
        user,
      },
      contextValue: {
        dbConnection: testDbConnection,
      },
    });

    expect(result).toMatchObject({
      errors: [
        expect.objectContaining({
          message: "Argument Validation Error",
          locations: expect.any(Array),
          path: ["signUp"],
        }),
      ],
    });
  });

  it("SignUp with all valid fields", async () => {
    const user = generateFakeUser();
    let result: any = await makeGraphQLQuery({
      source: signUpMutation,
      variableValues: {
        user,
      },
      contextValue: {
        dbConnection: testDbConnection,
      },
    });

    const { password, ...rest } = user;
    expect(result).toMatchObject({
      data: {
        signUp: {
          ...rest,
          id: expect.any(String),
        },
      },
    });

    result = await testDbConnection
      .getRepository(User)
      .findOne({ where: { email: user.email } });

    expect(result).toMatchObject(expect.any(User));
    expect(result).toMatchObject({
      ...rest,
      id: expect.any(Number),
      password: expect.any(String),
    });

    const valid = await compare(password!, result.password);

    expect(valid).toBe(true);
  });
});
