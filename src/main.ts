import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { configureAppModule } from '@/app.module';
import { loadEnv } from '@/environment';

(async () => {
  const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike('AppName', {
            appName: false,
          }),
        ),
        level: logLevel,
      }),
    ],
  });
  logger.info(`Use log level: ${logLevel}`);

  const env = loadEnv(logger);
  const app = await NestFactory.create<NestExpressApplication>(configureAppModule(env), {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });

  await app.listen(env.server.port);
  logger.info(`Application is listening on: ${await app.getUrl()}`);
})();
