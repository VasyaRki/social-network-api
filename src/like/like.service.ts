import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { EntityService } from '../common/entity.service';
import { DeleteOrAddLike } from './responses/delete-or-add-like.response';

@Injectable()
export class LikeService extends EntityService<Like> {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {
    super(likeRepository);
  }

  async handleLike(authorId, entityId, entityType): Promise<DeleteOrAddLike> {
    const isLiked = await this.getOne({
      authorId,
      [entityType]: entityId,
    });

    if (isLiked) {
      const removed = await this.delete(isLiked.id);
      return { removed };
    }

    const like = await this.create({
      authorId,
      [entityType]: entityId,
    });

    return { added: !!like };
  }
}
