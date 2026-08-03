/**
 * @jest-environment jsdom
 */

const fs = require('fs');

describe('openModal functionality', () => {
    beforeEach(() => {
        // Set up clean DOM
        const html = fs.readFileSync('./index.html', 'utf8');
        document.body.innerHTML = html;

        // Handle JSDOM limitations
        window.scrollTo = jest.fn();
        jest.spyOn(console, 'error').mockImplementation(() => {});

        // Load the script
        const scripts = Array.from(document.querySelectorAll('script'));
        const targetScript = scripts.find(s => !s.src && s.innerHTML.includes('function openModal'));
        if (targetScript) {
            window.eval(targetScript.innerHTML);
        }
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('early returns when an invalid data key is passed', () => {
        const modalContainer = document.getElementById('modal-left-container');
        const serviceModal = document.getElementById('service-modal');

        const initialHtml = modalContainer.innerHTML;
        const initialClasses = [...serviceModal.classList];

        // Ensure we don't throw an error when accessing undefined data
        expect(() => window.openModal('invalid_key')).not.toThrow();

        // Ensure the DOM hasn't been updated
        expect(modalContainer.innerHTML).toBe(initialHtml);

        // Ensure the modal visibility hasn't changed (remains hidden)
        expect(serviceModal.classList.contains('hidden')).toBe(true);
    });
});
