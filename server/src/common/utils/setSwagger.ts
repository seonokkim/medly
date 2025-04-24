import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

export function setSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Medly Api Document')
    .setDescription('메들리 서비스 API 문서 입니다.')
    .setVersion('1.0.0')
    .addApiKey(
      {
        type: 'apiKey',
        description: `jwt 요청 헤더 형식은 'auth: {jwt-token}' 입니다.`,
        name: 'Authorization',
        in: 'header',
        bearerFormat: 'JWT',
      },
      'JWT',
    )
    .build();

  app.use(
    ['/api-docs', '/api-docs-json'],
    basicAuth({
      challenge: true,
      users: {
        medly: 'P@assword',
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
