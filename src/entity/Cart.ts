import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";

@ObjectType()
@Entity()
@Index(["email", "product"], { unique: true })
export class Cart {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  @ManyToOne(() => Product)
  product: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @Column()
  nos: number;

  @Field()
  @Column()
  priceForOne: string;
}
