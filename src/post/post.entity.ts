import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from 'src/tag/tag.entity';
import { User } from '../user/user.entity';
import { Like } from 'src/like/like.entity';
import { Comment } from 'src/comment/comment.entity';

@Entity()
@ObjectType()
export class Post {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.post, { nullable: true })
  like: Like[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.post, { nullable: true })
  comment: Comment[];

  @Field(() => [Tag])
  @ManyToMany(() => Tag, (tag) => tag.posts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  tags: Tag[];
}
