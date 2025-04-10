import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

import { configureAppModule } from '@/app.module';
import { loadEnv } from '@/environment';
import { RequtesLoggerInterceptor } from '@/interceptors/requests-logger';
import { logger } from '@/services/logger';
import { WinstonModule } from 'nest-winston';

(async () => {
  const env = loadEnv();
  const config = {
    env,
  };
  const app = await NestFactory.create(await configureAppModule(config), {
    logger: WinstonModule.createLogger({ instance: logger }),
  });

  app.useGlobalInterceptors(new RequtesLoggerInterceptor());

  patchNestJsSwagger();
  const optionsFederate = new DocumentBuilder()
    .setTitle('Identity Gateway API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const groupDocument = SwaggerModule.createDocument(app, optionsFederate);
  SwaggerModule.setup('/swagger', app, groupDocument, {
    jsonDocumentUrl: '/swagger/openapi.json',
    patchDocumentOnRequest: (request, response, document) => {
      document.openapi = '3.1.0';
      return document;
    },
  });

  await app.listen(Number.parseInt(process.env.PORT ?? '3000', 10), () => {
    Logger.log(`Server started on port ${process.env.PORT}`);
  });
})();
