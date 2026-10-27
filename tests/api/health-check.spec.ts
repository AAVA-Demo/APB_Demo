import { test, expect } from '@playwright/test';

test('API health check', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.ok()).toBeTruthy();
});
