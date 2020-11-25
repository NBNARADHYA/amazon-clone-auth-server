import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class Product {
  @Field({ nullable: true })
  @Column({ nullable: true })
  crawlTimeStamp: string;

  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nameSource: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  retailer: string;

  @Field()
  @Column()
  category: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  brand: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  price: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  url: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  currency: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  tags: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contents: string;
}
