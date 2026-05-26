const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

// Extract the handleChat function definition
const handleChatMatch = html.match(/async function handleChat\(\) \{[\s\S]*?\n        \}/);
if (!handleChatMatch) {
  throw new Error('handleChat function not found in index.html');
}

const handleChatCode = handleChatMatch[0];

describe('handleChat', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <ul id="chat-box"></ul>
      <input id="chat-input" value="Hello, Ev!" />
    `;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should append user message and bot response', async () => {
    // Add handleChat to global scope
    eval(handleChatCode);

    const input = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');

    expect(chatBox.innerHTML).toBe('');

    await handleChat();

    // Check user message
    expect(chatBox.innerHTML).toContain('Hello, Ev!');
    expect(input.value).toBe('');

    // Advance timers
    jest.advanceTimersByTime(1000);

    // Check bot response
    expect(chatBox.innerHTML).toContain('Soy Ev.');
  });

  it('should not do anything if input is empty', async () => {
    eval(handleChatCode);

    document.getElementById('chat-input').value = '';
    const chatBox = document.getElementById('chat-box');

    await handleChat();

    expect(chatBox.innerHTML).toBe('');
  });
});
