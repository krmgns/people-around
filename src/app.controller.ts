import { Controller, Get, Post, Put, Delete, Param, Query, Body, HttpCode } from '@nestjs/common';
import { User, UserLike } from '@prisma/client'
import { FeedService } from './service.feed';
import { LikeService } from './service.like';
import { UserService } from './service.user';
import { FeedParams, LikeParams, UnlikeParams } from './data/params';
import { UserLoginDTO, UserLogoutDTO, UserRegisterDTO, UserUpdateDTO } from './data/trans';
import { getRandomLatitude, getRandomLongitude } from './data/utils';

@Controller()
export class AppController {
  constructor(
    private feedService: FeedService,
    private likeService: LikeService,
    private userService: UserService
  ) {}

  @Get('/feed')
  getFeed(
    @Query('location') location?: string,
    @Query('distance') distance?: string,
    @Query('metric') metric?: string,
  ): Promise<User[]> {
    // @todo
    const userLocation: string = location || `${getRandomLatitude()},${getRandomLongitude()}`;
    const userDistance: number = 100_000;
    const params: FeedParams = {
      location: userLocation,
      distance: userDistance,
      metric
    };

    return this.feedService.list(params);
  }

  @Get('/user/:id')
  getUser(
    @Param('id') id: string
  ): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post('/user/:id/like')
  likeUser(
    @Param('id') id: string,
    @Query('action') action: string
  ): Promise<UserLike> {
    // @todo
    const userId: number = 1;
    const params: LikeParams = {
      likerId: userId, likedId: id, action
    };

    return this.likeService.like(params);
  }

  @Delete('/user/:id/like')
  unlikeUser(
    @Param('id') id: string
  ): Promise<UserLike> {
    // @todo
    const userId: number = 1;
    const params: UnlikeParams = {
      likerId: userId, likedId: id
    };

    return this.likeService.unlike(params);
  }

  @Post('/user/login')
  @HttpCode(200)
  userLogin(
    @Body() body: UserLoginDTO
  ): Promise<User> {
    return this.userService.login(body);
  }

  @Post('/user/logout')
  @HttpCode(200)
  userLogout(
    @Body() body: UserLogoutDTO
  ): Promise<object> {
    return this.userService.logout(body);
  }

  @Post('/user/register')
  userRegister(
    @Body() body: UserRegisterDTO
  ): Promise<User> {
    return this.userService.register(body);
  }

  @Put('/user/update')
  userUpdate(
    @Body() body: UserUpdateDTO
  ): Promise<User> {
    return this.userService.update(body);
  }
}
