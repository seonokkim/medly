import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

import { AppModule } from './app.module';
import { setSwagger } from './common/utils/setSwagger';

async function bootstrap() {
  const isProd = process.env.DB_DATABASE !== 'medly_local';
  // const isProd = process.env.DB_DATABASE !== 'medly';

  const app = isProd
    ? await NestFactory.create(AppModule, {
        httpsOptions: {
          key: fs.readFileSync(process.env.LETS_ENCRYPT_PRIVKEY_PATH),
          cert: fs.readFileSync(process.env.LETS_ENCRYPT_FULLCHAIN_PATH),
        },
      })
    : await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  setSwagger(app);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
