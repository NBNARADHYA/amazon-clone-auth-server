import { Connection } from "typeorm";
import { makeGraphQLQuery } from "../graphQLQuery";
import { User } from "../../entity/User";
import faker from "faker";

export interface FakeUser extends Partial<User> {}

export const generateFakeUser = (): FakeUser => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
});

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

export const signUpFakeUser = async (
  testDbConnection: Connection
): Promise<FakeUser> => {
  const user = generateFakeUser();
  await makeGraphQLQuery({
    source: signUpMutation,
    variableValues: {
      user,
    },
    contextValue: {
      dbConnection: testDbConnection,
    },
  });
  return user;
};

export const loginFakeUser = async (
  testDbConnection: Connection,
  user: FakeUser
): Promise<string> => {
  const result = await makeGraphQLQuery({
    source: loginMutation,
    variableValues: {
      password: user.password,
      email: user.email,
    },
    contextValue: {
      dbConnection: testDbConnection,
      res: {
        cookie: jest.fn(),
      },
    },
  });
  return result.data!.login.accessToken;
};
