import { test, expect } from '@playwright/test';

test('Two clients can exchange messages in same group', async ({ browser }) => {
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  // Client 1
  await page1.goto('http://localhost:5173');
  await page1.waitForSelector('input[placeholder="Username"]');
  await page1.fill('input[placeholder="Username"]', 'Alex');
    await page1.fill('input[placeholder="Group"]', 'group1');
  await page1.click('button:has-text("Join")');

  // Client 2
  await page2.goto('http://localhost:5173');
  await page2.fill('input[placeholder="Username"]', 'Bob');
  await page2.fill('input[placeholder="Group"]', 'group1');
  await page2.click('button:has-text("Join")');

  // Client 1 sends message
  await page1.fill('input[placeholder^="Your message"]', 'Hi Bob!');
  await page1.click('button:has-text("Send")');

  // Client 2 gets message
  await expect(page2.locator('text=Alex: Hi Bob!')).toBeVisible();
});
