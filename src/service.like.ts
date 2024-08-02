import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserLike } from '@prisma/client';
import { PrismaLink } from './data/prisma';
import { LikeDTO } from './data/trans';
import { LikeModel } from './data/models';
import { LikeParams, UnlikeParams } from './data/params';

@Injectable()
export class LikeService {
  constructor(private link: PrismaLink) {}

  /**
   * Save a like or dislike.
   */
  async like(params: LikeParams): Promise<UserLike> {
    const model = new LikeModel(params);

    if (!model.validateLikeData()) {
      throw new HttpException('Invalid like data', HttpStatus.BAD_REQUEST);
    }

    const { likerId, likedId, action } = model.getData() as LikeDTO;
    const like: UserLike | null = await this.find({ likerId, likedId });

    if (like?.action === action) {
      throw new HttpException('Already liked / disliked', HttpStatus.CONFLICT);
    }

    return this.link.userLike.upsert({
      // @see UserLike in schema.prisma file.
      where: { likeId: { likerId, likedId } },
      create: { likerId, likedId, action },
      update: { action }
    });
  }

  /**
   * Remove a like or dislike.
   */
  async unlike(params: UnlikeParams): Promise<UserLike> {
    const model = new LikeModel(params);

    if (!model.validateUnlikeData()) {
      throw new HttpException('Invalid unlike data', HttpStatus.BAD_REQUEST);
    }

    const { likerId, likedId } = model.getData() as LikeDTO;
    const like: UserLike | null = await this.find({ likerId, likedId });

    if (!like) {
      throw new HttpException('No like found to remove', HttpStatus.NOT_FOUND);
    }

    return this.link.userLike.delete({
      // @see UserLike in schema.prisma file.
      where: { likeId: { likerId, likedId } },
    });
  }

  private async find(where: object): Promise<UserLike | null> {
    return this.link.userLike.findFirst({
      where
    });
  }
}
