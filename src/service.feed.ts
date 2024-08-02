import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { RedisService } from 'nestjs-redis';
import { PrismaLink } from './data/prisma';
import { FeedParams } from './data/params';
import { Json, toKey } from './data/utils';

@Injectable()
export class FeedService {
  private METRIC_KM: number = 0.001;
  private METRIC_MI: number = 0.000621371192;

  constructor(
    private link: PrismaLink,
    private redis: RedisService
  ) {}

  /**
   * List users.
   */
  async list(params: FeedParams): Promise<User[]> {
    let { location, distance, metric } = params;

    // Some security checks can be applied here.
    const latlon: string[] = location.split(',');
    const latitude: number = Number(latlon[0]);
    const longitude: number = Number(latlon[1]);

    // 1 kilometer as default.
    const proximity: number = Number(distance) || 1;

    // Detect metric factor.
    let metricFactor: number;
    switch ((metric ?? 'km').toLowerCase()) {
      case 'km': metricFactor = this.METRIC_KM; break;
      case 'mi': metricFactor = this.METRIC_MI; break;
      default:
        throw new HttpException(
          'Invalid metric, valids: km, mi', HttpStatus.BAD_REQUEST);
    }

    const query = Prisma.sql `
      SELECT *, ST_Distance_Sphere(
        POINT(${longitude}, ${latitude}),
        POINT(longitude, latitude)
      ) * ${metricFactor} AS _distance
      FROM \`User\`
      HAVING (_distance <= ${proximity})
      ORDER BY _distance ASC, id DESC
    `;

    const cache = await this.redis.getClient();
    const key = toKey('users', query);

    const value: any = await cache.get(key);
    let users: User[];

    if (value) {
      users = Json.decode(value);
    } else {
      users = await this.link.$queryRaw<User[]>(query);
      cache.set(key, Json.encode(users));
    }

    if (users?.length) {
      users.map((user: User) => {
        delete user.password;
        return user;
      });
    }

    return users;
  }
}
