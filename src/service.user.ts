import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { RedisService } from 'nestjs-redis';
import { PrismaLink } from './data/prisma';
import { UserLoginDTO, UserLogoutDTO, UserRegisterDTO, UserUpdateDTO } from './data/trans';
import { UserLoginModel, UserLogoutModel, UserRegisterModel, UserUpdateModel } from './data/models';
import { Json, toKey } from './data/utils';

@Injectable()
export class UserService {
  constructor(
    private link: PrismaLink,
    private redis: RedisService
  ) {}

  /**
   * Find a user by given id.
   */
  async findOne(id: string): Promise<User> {
    const user: User | null = await this.find({ id: Number(id) });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Not needed.
    delete user.password;

    return user;
  }

  /**
   * User login.
   */
  async login(params: UserLoginDTO): Promise<User> {
    const model = new UserLoginModel(params);

    if (!model.validateData()) {
      throw new HttpException('Invalid login data', HttpStatus.BAD_REQUEST);
    }

    const { email, password } = model.getData() as UserLoginDTO;
    const cache = await this.redis.getClient();
    const key = toKey('user', email);

    let user: any = await cache.get(key);

    if (user) {
      user = Json.decode(user);
      console.log('Found user in cache:', user);
    } else {
      user = await this.find({ email });
      console.log('Saved user to cache:', user);
      cache.set(key, Json.encode(user));
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // @todo Pasword check with JWT.
    if (user.password !== password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Not needed.
    delete user.password;

    return user as User;
  }

  /**
   * User logout.
   */
  async logout(params: UserLogoutDTO): Promise<object> {
    const model = new UserLogoutModel(params);

    if (!model.validateData()) {
      throw new HttpException('Invalid logout data', HttpStatus.BAD_REQUEST);
    }

    const { email } = model.getData() as UserLogoutDTO;
    const cache = await this.redis.getClient();
    const key = toKey('user', email);

    let user: any = await cache.get(key);

    if (user) {
      cache.del(key);
      return { okay: true, email: email };
    }

    // Already logged out.
    return { okay: false, email: email };
  }

  /**
   * User register.
   */
  async register(params: UserRegisterDTO): Promise<User> {
    const model = new UserRegisterModel(params);

    if (!model.validateData()) {
      throw new HttpException('Invalid register data', HttpStatus.BAD_REQUEST);
    }

    const data: UserRegisterDTO = model.getData();
    const user: User | null = await this.find({ email: data.email });

    if (user) {
      throw new HttpException('Email taken already', HttpStatus.CONFLICT);
    }

    return this.link.user.create({ data: data });
  }

  /**
   * User update (profile).
   */
  async update(params: UserUpdateDTO): Promise<User> {
    const model = new UserUpdateModel(params);

    if (!model.validateData()) {
      throw new HttpException('Invalid update data', HttpStatus.BAD_REQUEST);
    }

    const data: UserUpdateDTO = model.getData();
    const user: User | null = await this.find({ id: data.id });

    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.link.user.update({
        where: { id: data.id },
        data: data
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new HttpException('Email taken already', HttpStatus.CONFLICT);
      }
      throw e;
    }
  }

  private async find(where: object): Promise<User | null> {
    return this.link.user.findFirst({
      where
    });
  }
}
