import { Field, Float, Int, ObjectType } from "type-graphql";
import {
  Column,
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
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Float)
  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: number;

  @Field()
  @Column({ type: "text" })
  address: string;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column()
  state: string;

  @Field()
  @Column()
  pincode: string;

  @Field()
  @Column()
  city: string;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: "email" })
  user: User;

  @Field(() => [OrderContent])
  @OneToMany(() => OrderContent, (orderContents) => orderContents.order)
  products: OrderContent[];
}
