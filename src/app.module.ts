import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

import { EnvironmentVariables } from '@/environment';
import { HealthModule } from '@/modules/health/health.module';

// TODO: Define the configuration schema
export const configSchema = z.object({
  logLevel: z.string(),
  server: z.object({
    port: z.number(),
  }),
  universalAnswer: z.number(),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(env: EnvironmentVariables): Config {
  return configSchema.parse({
    logLevel: env.logLevel,
    server: env.server,
    universalAnswer: 42,
  });
}

export function configureAppModule(env: EnvironmentVariables): new () => NestModule {
  @Module({
    imports: [ConfigModule.forRoot({ load: [() => loadConfig(env)] }), HealthModule],
    controllers: [],
    providers: [],
  })
  class App implements NestModule {
    configure(): void {}
  }

  return App;
}
