import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';

import { configureAppModule } from '@/app.module';
import { AppService } from '@/app.service';
import { loadEnv } from '@/environment';

import { logger } from './services/logger';

(async () => {
  const env = loadEnv();

  const app = await NestFactory.createApplicationContext(configureAppModule(env), {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });

  const appService = app.get<AppService>(AppService);
  await appService.run();
})();
