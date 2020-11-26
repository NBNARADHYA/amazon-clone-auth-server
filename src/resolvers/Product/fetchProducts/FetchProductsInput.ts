import { Field, ArgsType, registerEnumType } from "type-graphql";

enum OrderEnum {
  ASC = "ASC",
  DESC = "DESC",
}

registerEnumType(OrderEnum, {
  name: "OrderEnum",
});

@ArgsType()
export class FetchProductsInput {
  @Field()
  category: string;

  @Field(() => OrderEnum, { nullable: true, defaultValue: undefined })
  order: "ASC" | "DESC" | undefined;

  @Field()
  skip: number;

  @Field()
  take: number;
}
