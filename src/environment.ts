import { Logger } from '@nestjs/common';
import { z } from 'zod';

export const environmentVariablesSchema = z.object({
  ENV: z.string(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'verbose', 'debug', 'silly']).optional().default('info'),
  PORT: z.string().transform((value) => parseInt(value, 10)),
});

export type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;

export function loadEnv(): EnvironmentVariables {
  const config = environmentVariablesSchema.parse(process.env);
  Logger.debug(`Parsed environment variables ${JSON.stringify(config, null, 2)}`);
  return config;
}
