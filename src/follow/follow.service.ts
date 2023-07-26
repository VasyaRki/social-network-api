import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { EntityService } from '../common/entity.service';
import { IUnfollow } from './interfaces/unfollow.interface';

export class FollowService extends EntityService<Follow> {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {
    super(followRepository);
  }

  public async unfollow(unfollowInput: IUnfollow): Promise<boolean> {
    const payload = await super.getOne(unfollowInput);
    const id = payload?.id;

    return super.delete(id);
  }
}
