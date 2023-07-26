import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from '../post/post.entity';
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

  @Field(() => String)
  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  socketId: string;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => Post, (posts) => posts.user)
  posts: Post[];
}
