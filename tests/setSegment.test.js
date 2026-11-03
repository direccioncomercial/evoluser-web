/** @jest-environment jsdom */
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('setSegment', () => {
    beforeEach(() => {
        // Inject HTML
        document.documentElement.innerHTML = html.toString();

        // Suppress expected JSDOM internal error on document.querySelectorAll from MutationObserver
        jest.spyOn(console, 'error').mockImplementation(() => {});

        // Mock scrollTo
        window.scrollTo = jest.fn();

        // Extract the full inline script from JSDOM parser and evaluate it
        const scripts = document.querySelectorAll('script');
        let inlineScript = '';
        scripts.forEach(script => {
            if (script.innerHTML && script.innerHTML.includes('function setSegment')) {
                inlineScript = script.innerHTML;
            }
        });

        if (inlineScript) {
            window.eval(inlineScript);
        }
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    test('should add active class to target nav and remove from others', () => {
        const navEmpresas = document.getElementById('nav-empresas');
        const navSoluciones = document.getElementById('nav-soluciones');

        // Setup initial state
        navSoluciones.classList.add('active');
        navEmpresas.classList.remove('active');

        window.setSegment('empresas');

        expect(navEmpresas.classList.contains('active')).toBe(true);
        expect(navSoluciones.classList.contains('active')).toBe(false);
    });

    test('should show target segment and hide others', () => {
        // Setup initial state
        document.getElementById('segment-soluciones').classList.remove('hidden');
        document.getElementById('segment-empresas').classList.add('hidden');

        window.setSegment('empresas');

        expect(document.getElementById('segment-empresas').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('segment-soluciones').classList.contains('hidden')).toBe(true);
    });

    test('should scroll to top smoothly', () => {
        window.setSegment('empresas');
        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
});
