const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('openModal function', () => {
    let window;
    let document;

    beforeEach(() => {
        // Read the actual HTML file
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

        // Initialize a clean DOM structure needed by the function to avoid errors from other global scripts
        const testDom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <body>
                <div id="modal-left-container"></div>
                <div id="modal-content"></div>
                <div id="service-modal" class="hidden"></div>
            </body>
            </html>
        `, { runScripts: 'dangerously' });

        window = testDom.window;
        document = window.document;

        // Instead of executing the whole script block from index.html that might fail due to missing DOM elements,
        // we use JSDOM's ability to evaluate just the needed functions from the HTML
        const dom = new JSDOM(html);
        const scripts = Array.from(dom.window.document.querySelectorAll('script'));
        let relevantScriptText = scripts.find(s => s.textContent.includes('function openModal(type)'))?.textContent;

        if (relevantScriptText) {
            // Find start of contentData
            const startDataIndex = relevantScriptText.indexOf('const contentData =');
            // Find start of closeModal
            const startCloseModalIndex = relevantScriptText.indexOf('function closeModal()');

            if (startDataIndex !== -1 && startCloseModalIndex !== -1) {
                // Extract only contentData and openModal safely using string indexes instead of regex
                const extractedLogic = relevantScriptText.substring(startDataIndex, startCloseModalIndex);

                const scriptEl = document.createElement('script');
                scriptEl.textContent = extractedLogic + '\nwindow.contentData = contentData;\nwindow.openModal = openModal;';
                document.body.appendChild(scriptEl);
            }
        }
    });

    afterEach(() => {
        window.close();
    });

    test('renders filosofia_premium type correctly from actual script', () => {
        window.openModal('filosofia_premium');

        const leftContainer = document.getElementById('modal-left-container');
        const modalContent = document.getElementById('modal-content');
        const serviceModal = document.getElementById('service-modal');

        expect(leftContainer.innerHTML).toContain('EvoluSer Vertical');
        expect(leftContainer.innerHTML).toContain('transform -rotate-90 filter drop-shadow-xl');

        expect(modalContent.innerHTML).toContain('Filosofía EvoluSer');
        expect(modalContent.innerHTML).toContain('Carta a nuestros Clientes');
        expect(modalContent.innerHTML).toContain('Misión');
        expect(modalContent.innerHTML).toContain('Visión');

        expect(serviceModal.classList.contains('hidden')).toBe(false);
        expect(serviceModal.classList.contains('flex')).toBe(true);
    });

    test('renders standard type (e.g. humano) correctly from actual script', () => {
        window.openModal('humano');

        const leftContainer = document.getElementById('modal-left-container');
        const modalContent = document.getElementById('modal-content');
        const serviceModal = document.getElementById('service-modal');

        expect(leftContainer.innerHTML).toContain('modal-image');
        expect(leftContainer.innerHTML).toContain('w-full h-full object-contain bg-gray-50');

        expect(modalContent.innerHTML).toContain('Gestión de Talento');
        expect(modalContent.innerHTML).toContain('Nury Echeverria');
        expect(modalContent.innerHTML).toContain('Directora de Talento');
        expect(modalContent.innerHTML).toContain('Reclutamiento Senior');
    });

    test('returns early if type is invalid', () => {
        window.openModal('invalid_type');

        const leftContainer = document.getElementById('modal-left-container');
        expect(leftContainer.innerHTML).toBe(''); // Should be untouched
    });
});
