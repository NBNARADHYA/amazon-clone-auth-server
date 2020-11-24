import { Connection } from "typeorm";
import { makeGraphQLQuery } from "../graphQLQuery";
import { User } from "../../entity/User";
import faker from "faker";

export interface FakeUser extends Partial<User> {}

export const generateFakeUser = (): FakeUser => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };
};

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
