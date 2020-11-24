import { Connection } from "typeorm";
import { makeGraphQLQuery } from "../../test-utils/graphQLQuery";
import { setUpTest } from "../../test-utils/setup";

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
  it("signup", async () => {
    const result = await makeGraphQLQuery({
      source: signUpMutation,
      variableValues: {
        user: { password: "nbnaradhya", email: "nb55n", firstName: "nikhil" },
      },
      contextValue: {
        dbConnection: testDbConnection,
      },
    });
    console.log(result);
  });
});
