// import { IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { User } from "../../../entity/User";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";
@InputType()
export class SignUpInput implements Partial<User> {
  @Field()
  // @IsEmail()
  @IsEmailAlreadyExist({ message: "EMAIL_ALREADY_IN_USE" })
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName: string;
}
