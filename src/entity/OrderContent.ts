import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Order } from "./Order";

@ObjectType()
@Entity()
export class OrderContent {
  @Field()
  @PrimaryColumn()
  productId: string;

  @Field(() => Int)
  @Column()
  priceForOne: number;

  @Field(() => Int)
  @Column()
  nos: number;

  @ManyToOne(() => Order, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ referencedColumnName: "id" })
  order: Order;
}
