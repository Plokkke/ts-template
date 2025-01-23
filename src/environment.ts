import { Logger } from 'winston';
import { z } from 'zod';

export const environmentVariablesSchema = z
  .object({
    LOG_LEVEL: z.string(),
    PORT: z.coerce.number().optional().default(3000),
  })
  .transform((env) => ({
    logLevel: env.LOG_LEVEL,
    server: {
      port: env.PORT,
    },
  }));

export type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;

export function loadEnv(logger: Logger): EnvironmentVariables {
  const config = environmentVariablesSchema.parse(process.env);
  logger.debug(`Parsed environment variables ${JSON.stringify(config, null, 2)}`);
  return config;
}
