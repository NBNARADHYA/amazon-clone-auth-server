import { Ctx, Mutation, Resolver } from "type-graphql";
import { Context } from "../../types/Context";

@Resolver(() => Boolean)
export class Logout {
  @Mutation()
  logout(@Ctx() { res }: Context): boolean {
    res.clearCookie("jid");
    return true;
  }
}
