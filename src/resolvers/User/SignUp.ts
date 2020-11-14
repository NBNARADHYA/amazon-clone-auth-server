import { hash } from "bcryptjs";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../../entity/User";
import { Context } from "../Context";
import { isEmailAlreadyExist } from "./signUp/isEmailAlreadyExist";
import { SignUpInput } from "./signUp/SignUpInput";

@Resolver()
export class SignUp {
  @Query(() => String)
  hello() {
    return "hello world!";
  }

  @Mutation(() => User)
  @UseMiddleware(isEmailAlreadyExist)
  async signUp(
    @Arg("user") { email, password, firstName, lastName }: SignUpInput,
    @Ctx() { dbConnection }: Context
  ): Promise<User> {
    const hashedPassword = await hash(password, 10);

    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.firstName = firstName;
    user.lastName = lastName;

    try {
      await dbConnection.manager.insert(User, user);
    } catch (error) {
      throw new Error(error);
    }

    return user;
  }
}
