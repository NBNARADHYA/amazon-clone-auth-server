import { IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { User } from "../../../entity/User";
@InputType()
export class SignUpInput implements Partial<User> {
  @IsEmail()
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName: string;
}
