import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

import { AppService } from '@/app.service';
import { EnvironmentVariables } from '@/environment';

// TODO: Define the configuration schema
export const configSchema = z.object({
  logLevel: z.string(),
  universalAnswer: z.number(),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(env: EnvironmentVariables): Config {
  return configSchema.parse({
    logLevel: env.logLevel,
    universalAnswer: 42,
  });
}

export function configureAppModule(env: EnvironmentVariables): new () => NestModule {
  @Module({
    imports: [ConfigModule.forRoot({ load: [() => loadConfig(env)] })],
    providers: [AppService],
  })
  class App implements NestModule {
    configure(): void {}
  }

  return App;
}
