import { Field, ID, Int, ObjectType } from "type-graphql";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
@Index(["email", "productId"], { unique: true })
export class Cart {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  productId: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @Column()
  nos: number;

  @Field(() => Int)
  @Column()
  priceForOne: number;
}
