import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class OrderContent {
  @Field(() => ID)
  @Generated("uuid")
  @Column()
  id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ referencedColumnName: "id" })
  @Field(() => Product)
  @PrimaryColumn()
  product: string;

  @Field(() => Int)
  @Column()
  nos: number;

  @ManyToOne(() => Order, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ referencedColumnName: "id" })
  order: Order;
}
