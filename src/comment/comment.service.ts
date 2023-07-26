import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { EntityService } from 'src/common/entity.service';
import { DeleteCommentI } from './interfaces/delete-comment.interface';

@Injectable()
export class CommentService extends EntityService<Comment> {
  constructor(@InjectRepository(Comment) private service: Repository<Comment>) {
    super(service);
  }

  public async deleteComment(
    deleteCommentInput: DeleteCommentI,
  ): Promise<boolean> {
    const { commentId } = deleteCommentInput;
    const { authorId } = deleteCommentInput;
    const comment = await super.getOne({ id: commentId });

    if (comment.authorId !== authorId) {
      return false;
    }

    return super.delete(commentId);
  }
}
