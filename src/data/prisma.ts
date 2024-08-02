import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaLink extends PrismaClient implements OnModuleInit {
  constructor() {
    // For local query logs.
    super({ log: ['query'] });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();

    // For local query logs.
    // @ts-ignore
    this.$on('query', (e) => {
      // @ts-ignore
      console.log(`${e.query} ${e.params}`);
    });
  }
}
