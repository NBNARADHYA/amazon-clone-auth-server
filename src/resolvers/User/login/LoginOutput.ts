import { Field, ObjectType } from "type-graphql";
import { User } from "../../../entity/User";

@ObjectType()
export class LoginOutput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field()
  accessToken: string;
}
