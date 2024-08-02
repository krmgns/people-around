import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis'
import { AppController } from './app.controller';
import { FeedService } from './service.feed';
import { LikeService } from './service.like';
import { UserService } from './service.user';
import { PrismaLink } from './data/prisma';

@Module({
  imports: [
    RedisModule.register({})
  ],
  controllers: [
    AppController
  ],
  providers: [
    FeedService, LikeService, UserService,
    PrismaLink
  ],
})
export class AppModule {}
