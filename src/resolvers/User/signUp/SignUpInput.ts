import { IsEmail } from "class-validator";
import { MaxLength, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { User } from "../../../entity/User";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";
@InputType()
export class SignUpInputType implements Partial<User> {
  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "EMAIL_ALREADY_IN_USE" })
  email: string;

  @MinLength(5)
  @MaxLength(15)
  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName: string;
}
