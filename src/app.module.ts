import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { HealthModule } from '@plokkke/nest-health-registry';
import { ZodValidationPipe } from 'nestjs-zod';
import { z as zod } from 'zod';
import { errorMap } from 'zod-validation-error';

zod.setErrorMap(errorMap);

export const configSchema = zod.object({});

export type Config = zod.infer<typeof configSchema>;

export async function configureAppModule(config: Config): Promise<new () => NestModule> {
  @Module({
    imports: [ConfigModule.forRoot({ load: [() => config], isGlobal: true }), HealthModule],
    controllers: [],
    providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
  })
  class AppModule implements NestModule {
    configure(): void {}
  }

  return AppModule;
}
