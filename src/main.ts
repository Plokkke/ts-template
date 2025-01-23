import { NestFactory } from '@nestjs/core';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { configureAppModule } from '@/app.module';
import { AppService } from '@/app.service';
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
  const app = await NestFactory.createApplicationContext(configureAppModule(env), {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });

  const appService = app.get<AppService>(AppService);
  await appService.run();
})();
