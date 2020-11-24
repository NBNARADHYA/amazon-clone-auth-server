import { makeGraphQLQuery } from "../../test-utils/graphQLQuery";

describe("Test logout mutation", () => {
  const logoutMutation: string = `
        mutation {
            logout
        }
    `;
  it("test logout", async () => {
    const expressClearCookieMock = jest.fn();

    const result = await makeGraphQLQuery({
      source: logoutMutation,
      contextValue: {
        res: {
          clearCookie: expressClearCookieMock,
        },
      },
    });
    expect(result).toMatchObject({
      data: {
        logout: true,
      },
    });

    expect(expressClearCookieMock.mock.calls.length).toBe(1);
    expect(expressClearCookieMock.mock.calls[0][0]).toBe("jid");
  });
});
