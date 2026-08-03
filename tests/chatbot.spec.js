const { test, expect } = require('@playwright/test');

test.describe('Chatbot Interaction E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open the chatbot window', async ({ page }) => {
    const chatWindow = page.locator('#ai-chat-window');

    // Initially hidden
    await expect(chatWindow).toHaveClass(/(^|\s)hidden(\s|$)/);

    // Open the chatbot using evaluate to avoid animation interference
    await page.evaluate("document.getElementById('ev-avatar-trigger').click()");

    // Verify it is no longer hidden
    await expect(chatWindow).not.toHaveClass(/(^|\s)hidden(\s|$)/);
  });

  test('should ignore empty input', async ({ page }) => {
    // Open chat
    await page.evaluate("document.getElementById('ev-avatar-trigger').click()");

    const chatBox = page.locator('#chat-box');
    const sendButton = page.locator('button[onclick="handleChat()"]');

    // Initial state: 1 message (the greeting)
    await expect(chatBox.locator('li')).toHaveCount(1);

    // Send empty message
    await sendButton.click();

    // Wait a bit to ensure nothing happens
    await page.waitForTimeout(500);

    // Still 1 message
    await expect(chatBox.locator('li')).toHaveCount(1);
  });

  test('should send a message and receive bot response', async ({ page }) => {
    // Open chat
    await page.evaluate("document.getElementById('ev-avatar-trigger').click()");

    const chatInput = page.locator('#chat-input');
    const sendButton = page.locator('button[onclick="handleChat()"]');
    const chatBox = page.locator('#chat-box');

    const testMessage = 'Hello, this is a test message.';

    // Type and send message
    await chatInput.fill(testMessage);
    await sendButton.click();

    // Verify user message appears
    await expect(chatBox).toContainText(testMessage);

    // The bot reply is scheduled after 1000ms. Wait and verify it appears.
    // The expected simulated response contains 'Soy Ev. Mi consejo hoy:'
    await expect(chatBox).toContainText('Soy Ev. Mi consejo hoy:', { timeout: 2000 });

    // Check that there are now 3 messages (1 greeting + 1 user + 1 bot)
    await expect(chatBox.locator('li')).toHaveCount(3);
  });
});
