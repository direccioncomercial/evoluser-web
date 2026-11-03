/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('toggleChat function', () => {
    beforeAll(() => {
        // Read the HTML file
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

        // Setup document
        document.documentElement.innerHTML = html;

        // Find the script containing toggleChat
        const scripts = document.querySelectorAll('script');
        let targetScript = null;
        for (const script of scripts) {
            if (script.innerHTML.includes('function toggleChat()')) {
                targetScript = script.innerHTML;
                break;
            }
        }

        // Mock console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});

        // Mock window methods that might be missing in JSDOM
        window.scrollTo = jest.fn();
        window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
        window.cancelAnimationFrame = (id) => clearTimeout(id);

        // Extract toggleChat specifically to avoid other script execution issues
        const match = targetScript.match(/function toggleChat\(\) \{[\s\S]*?\}(?=\s*(async function|function|\/\/|$))/);
        if (match) {
            eval(match[0]);
            window.toggleChat = toggleChat;
        } else {
            throw new Error("Could not find toggleChat function in script");
        }
    });

    beforeEach(() => {
        jest.useFakeTimers();

        // Reset the state of ai-chat-window
        const win = document.getElementById('ai-chat-window');
        win.className = 'fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-500 transform scale-0 origin-bottom-right z-[90] hidden border border-gray-100 overflow-hidden';
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should open the chat window if it is hidden', () => {
        const win = document.getElementById('ai-chat-window');

        // Initially it has 'hidden' and 'scale-0'
        expect(win.classList.contains('hidden')).toBe(true);
        expect(win.classList.contains('scale-0')).toBe(true);

        // Call toggleChat
        window.toggleChat();

        // It should immediately remove 'hidden'
        expect(win.classList.contains('hidden')).toBe(false);
        // It should still have 'scale-0'
        expect(win.classList.contains('scale-0')).toBe(true);

        // Advance timers by 10ms
        jest.advanceTimersByTime(10);

        // It should remove 'scale-0'
        expect(win.classList.contains('scale-0')).toBe(false);
    });

    it('should close the chat window if it is visible', () => {
        const win = document.getElementById('ai-chat-window');

        // Set it to visible
        win.classList.remove('hidden');
        win.classList.remove('scale-0');

        // Call toggleChat
        window.toggleChat();

        // It should immediately add 'scale-0'
        expect(win.classList.contains('scale-0')).toBe(true);
        // It should not yet have 'hidden'
        expect(win.classList.contains('hidden')).toBe(false);

        // Advance timers by 300ms
        jest.advanceTimersByTime(300);

        // It should add 'hidden'
        expect(win.classList.contains('hidden')).toBe(true);
    });
});
