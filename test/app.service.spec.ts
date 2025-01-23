import { AppService } from '@/app.service';

describe('App service test suite', () => {
  const service = new AppService();
  it('should run', async () => {
    await service.run();

    expect(true).toBe(true);
  });
});
