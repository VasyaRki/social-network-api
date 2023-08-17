import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Provider } from './enums/provider.enum';

registerEnumType(Provider, {
  name: 'Provider',
});

@Entity()
@ObjectType()
export class User {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  username: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  password?: string;

  @Field(() => Provider, { nullable: true })
  @Column({ nullable: true })
  provider?: Provider;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  isAccountPrivate: boolean;

  @Column({ nullable: true })
  refreshToken: string;
}
