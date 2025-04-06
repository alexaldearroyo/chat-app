import { test, expect } from '@playwright/test';

test('Two clients can exchange messages in the same group', async ({ browser }) => {
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  // Go to app
  await page1.goto('http://localhost:5173');
  await page2.goto('http://localhost:5173');

  // Client 1: enter username and create group
  await page1.fill('input[placeholder="Username"]', 'Alex');
  await page1.click('button:has-text("Create new group")');
  await page1.fill('input[placeholder="New group name"]', 'Test Group');
  await page1.click('button:has-text("Create group")');

  // Wait for UI to update
  await page1.waitForSelector('.chat-box');

  // Client 2: enter username and select existing group
  await page2.fill('input[placeholder="Username"]', 'Bob');
  await page2.click('button.select-button'); // open dropdown
  await page2.click('button.dropdown-item:has-text("Test Group")');
  await page2.click('button:has-text("Join group")');

  // Wait for both to be connected
  await page2.waitForSelector('.chat-box');

  // Client 1 sends a message
  await page1.fill('input[placeholder^="Your message"]', 'Hi Bob!');
  await page1.click('button:has-text("Send")');

  // Client 2 should receive the message (wait for element and check text)
  const message = page2.locator('.message', { hasText: 'Hi Bob!' });
  await expect(message).toContainText('Alex');
});
