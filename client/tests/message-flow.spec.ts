import { test, expect } from '@playwright/test';

test('Two clients can exchange messages in the same group', async ({ browser }) => {
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  // Client 1: create a new group
  await page1.goto('http://localhost:5173');
  await page1.fill('input[placeholder="Username"]', 'Alex');
  await page1.click('button:has-text("Create new group")');
  await page1.fill('input[placeholder="New group name"]', 'group-test');
  await page1.click('button:has-text("Create group")');

  // Wait for confirmation that client 1 has joined the group
  await page1.waitForSelector('text=Your username: Alex');

  // Client 2: join the same group
  await page2.goto('http://localhost:5173');
  await page2.fill('input[placeholder="Username"]', 'Bob');
  await page2.click('button:has-text("Select a group")');
  await page2.click('text=group-test');
  await page2.click('button:has-text("Join group")');

  // Client 1 sends a message
  await page1.fill('input[placeholder^="Your message"]', 'Hi Bob!');
  await page1.click('button:has-text("Send")');

  // Client 2 should receive the message
  await expect(page2.locator('text=Alex: Hi Bob!')).toBeVisible();
});
