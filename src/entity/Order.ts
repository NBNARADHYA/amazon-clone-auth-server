import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderContent } from "./OrderContent";
import { User } from "./User";

@ObjectType()
@Entity()
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: "email" })
  user: User;

  @Field(() => [OrderContent])
  @OneToMany(() => OrderContent, (orderContents) => orderContents.order)
  products: OrderContent[];
}
