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
  @Column({ default: "PLACED" })
  status: string;

  @Column()
  stripeId: string;

  @Field()
  @Column({ type: "text", nullable: true })
  address: string;

  @Field()
  @Column({ nullable: true })
  country: string;

  @Field()
  @Column({ nullable: true })
  state: string;

  @Field()
  @Column({ nullable: true })
  postalCode: string;

  @Field()
  @Column({ nullable: true })
  city: string;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: "email" })
  user: User;

  @Field(() => [OrderContent])
  @OneToMany(() => OrderContent, (orderContents) => orderContents.order)
  products: OrderContent[];
}
