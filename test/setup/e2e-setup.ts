import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { configureAppModule } from '@/app.module';
import { EnvironmentVariables } from '@/environment';

export let APP: INestApplication;

const envVars = {} as unknown as EnvironmentVariables;

beforeAll(async () => {
  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [await configureAppModule(envVars)],
    }).compile();

    APP = moduleFixture.createNestApplication({ bodyParser: false });
    APP.setGlobalPrefix('bff');

    await APP.init();
  } catch (e) {
    console.error(e);
    throw e;
  }
});

afterAll(async () => {
  await APP.close();
});
