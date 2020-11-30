import { compare } from "bcryptjs";
import { Args, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { createAccessToken } from "../../utils/createAccessToken";
import { createRefreshToken } from "../../utils/createRefreshToken";
import { Payload } from "../../types/Payload";
import { Context } from "../../types/Context";
import { LoginArgsType } from "./login/LoginArgs";
import { LoginOutput } from "./login/LoginOutput";

@Resolver()
export class Login {
  @Mutation(() => LoginOutput)
  async login(
    @Args() { email, password }: LoginArgsType,
    @Ctx() { dbConnection, res }: Context
  ): Promise<LoginOutput> {
    const user = await dbConnection
      .getRepository(User)
      .findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid User");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Invalid Password");
    }
    const payload: Payload = {
      email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = createAccessToken(payload);

    const refreshToken = createRefreshToken(payload);

    res.cookie("jid", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/refresh_token",
    });

    return {
      email,
      firstName: user.firstName,
      lastName: user.lastName,
      accessToken,
    };
  }
}
