import { IsEmail } from "class-validator";
import { Field, ArgsType } from "type-graphql";
import { User } from "../../../entity/User";

@ArgsType()
export class LoginArgsType implements Partial<User> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
