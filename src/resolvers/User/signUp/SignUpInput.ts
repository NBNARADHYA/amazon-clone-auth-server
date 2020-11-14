import { IsEmail } from "class-validator";
import { User } from "src/entity/User";
import { Field, InputType } from "type-graphql";

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
