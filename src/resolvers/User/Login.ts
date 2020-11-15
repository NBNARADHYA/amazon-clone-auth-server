import { compare } from "bcryptjs";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { createAccessToken } from "../../utils/createAccessToken";
import { createRefreshToken } from "../../utils/createRefreshToken";
import { Payload } from "../../utils/Payload";
import { Context } from "../Context";
import { LoginInput } from "./login/LoginInput";
import { LoginOutput } from "./login/LoginOutput";

@Resolver()
export class Login {
  @Mutation(() => LoginOutput)
  async login(
    @Arg("login") { email, password }: LoginInput,
    @Ctx() { dbConnection, res }: Context
  ): Promise<LoginOutput> {
    const user = await dbConnection
      .getRepository(User)
      .findOne({ where: { email } });

    if (!user) {
      throw new Error("INVALID_USER");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("INVALID_PASSWORD");
    }
    const payload: Payload = {
      email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = createAccessToken(payload);

    const refreshToken = createRefreshToken(payload);

    res.cookie("jid", refreshToken, { httpOnly: true });

    return {
      email,
      firstName: user.firstName,
      lastName: user.lastName,
      accessToken,
    };
  }
}
