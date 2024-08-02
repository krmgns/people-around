import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

const port = process.env.PORT || 3000;
const main = async function (port) {
  console.log('> Starting Application: http://localhost:%s/\n', port);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.getHttpAdapter().getInstance().set('json spaces', 2);
  await app.listen(port);
};

main(port);
