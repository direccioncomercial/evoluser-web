const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// JSDOM requires TextEncoder globally in some setups (like Next/Nuxt versions), but since we removed setup file we add it here just in case, or simply let it be.
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('handleOfficeSubmit form validation', () => {
    let window;
    let document;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(console, 'error').mockImplementation(() => {});

        const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

        // JSDOM refuses to let us mock window.location and also throws errors on unhandled schema (mailto:)
        // Let's use standard JSDOM but execute a customized version of the inline script where location is re-routed
        const dom = new JSDOM(html, { runScripts: "outside-only" });
        window = dom.window;
        document = window.document;

        const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
        let match;
        let mainScript = '';
        while ((match = scriptRegex.exec(html)) !== null) {
            mainScript = match[1];
        }

        // Replace window.location.href with a global mock variable
        window.__mockLocationHref = '';
        mainScript = mainScript.replace('window.location.href =', 'window.__mockLocationHref =');

        // Evaluate modified script safely
        dom.window.eval(mainScript);

        window.scrollTo = jest.fn();
    });

    afterEach(() => {
        jest.useRealTimers();
        console.error.mockRestore();
    });

    it('should return early and not hide the form if fields are empty', () => {
        const eMock = { preventDefault: jest.fn() };

        expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('ov-success').classList.contains('hidden')).toBe(true);

        window.handleOfficeSubmit(eMock);

        expect(eMock.preventDefault).toHaveBeenCalled();

        expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('ov-success').classList.contains('hidden')).toBe(true);
        expect(window.__mockLocationHref).toBe('');
    });

    it('should submit if fields are filled', () => {
        const eMock = { preventDefault: jest.fn() };

        document.getElementById('ov-id').value = '123';
        document.getElementById('ov-phone').value = '456';
        document.getElementById('ov-city').value = 'Quito';
        document.getElementById('ov-message').value = 'Hello';

        window.handleOfficeSubmit(eMock);

        expect(eMock.preventDefault).toHaveBeenCalled();

        expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('ov-success').classList.contains('hidden')).toBe(false);
        expect(window.__mockLocationHref).toContain('mailto:evoluserec@gmail.com');
    });
});
