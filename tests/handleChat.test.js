/** @jest-environment jsdom */
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

jest.useFakeTimers();

describe('handleChat', () => {
    let window, document;

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        const dom = new JSDOM(html, { runScripts: 'dangerously' });
        window = dom.window;
        document = window.document;

        // Mock requestAnimationFrame / cancelAnimationFrame
        window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
        window.cancelAnimationFrame = (id) => clearTimeout(id);

        // Mock window.scrollTo
        window.scrollTo = jest.fn();

        // Advance timers to trigger setInterval/setTimeout in DOM loaded listeners
        jest.advanceTimersByTime(100);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should return early if input is empty', async () => {
        const input = document.getElementById('chat-input');
        const chatBox = document.getElementById('chat-box');

        input.value = '';
        const initialChildrenCount = chatBox.children.length;

        // Wait, handleChat is an async function in the window object.
        await window.handleChat();

        expect(chatBox.children.length).toBe(initialChildrenCount);
    });

    test('should add user message and bot response when input has text', async () => {
        const input = document.getElementById('chat-input');
        const chatBox = document.getElementById('chat-box');

        input.value = 'Hello Ev';
        const initialChildrenCount = chatBox.children.length;

        await window.handleChat();

        // user message should be added
        expect(chatBox.children.length).toBe(initialChildrenCount + 1);
        expect(chatBox.innerHTML).toContain('Hello Ev');
        expect(input.value).toBe('');

        // Fast-forward 1000ms for bot response
        jest.advanceTimersByTime(1000);

        // bot response should be added
        expect(chatBox.children.length).toBe(initialChildrenCount + 2);
        expect(chatBox.innerHTML).toContain('Soy Ev. Mi consejo hoy');
    });
});
