const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('openModal', () => {
    let document;
    let window;
    let _openModal;
    let _contentData;
    let dom;

    beforeAll(() => {
        let html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

        // To extract the code correctly and avoid hanging JSDOM:
        // We find the <script> block and replace all top level `const contentData` with `window.contentData`
        // and `function openModal` with `window.openModal = function openModal`

        const scripts = html.match(/<script>([\s\S]*?)<\/script>/g);
        let targetScriptContent = "";
        if (scripts) {
            for (const s of scripts) {
                if (s.includes('function openModal(type)')) {
                    targetScriptContent = s.replace(/<\/?script>/g, '');
                    break;
                }
            }
        }
        if (!targetScriptContent) throw new Error("Script not found");

        // The previous error "Unexpected token ')'" was likely caused by incomplete regex replacements for setTimeout/setInterval
        // Instead of replacing them, let's just extract the exact parts we need using regex against the full block,
        // since JSDOM + eval for the whole block is proving very brittle.
        // Wait, the instructions say avoid "brace-counting string extraction". JSDOM with runScripts dangerously is preferred.

        // So let's load the full HTML into JSDOM. We will just stub out the hanging functions on the window object BEFORE loading HTML.
        const virtualConsole = new (require('jsdom')).VirtualConsole();
        virtualConsole.on("error", () => { /* Suppress */ });
        virtualConsole.on("jsdomError", () => { /* Suppress */ });

        // Let's remove the script that loads the youtube iframe API as it hangs.
        html = html.replace(/<script src="https:\/\/www\.youtube\.com\/iframe_api"><\/script>/gi, '');
        // Remove the tailwind script as it might hang too
        html = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/gi, '');

        dom = new JSDOM(html, {
            runScripts: "dangerously",
            virtualConsole,
            beforeParse(window) {
                // Mock things that could cause issues or hangs
                window.setInterval = () => {};
                window.setTimeout = (cb) => { cb(); };
            }
        });

        window = dom.window;
        document = window.document;

        // Since we are running the scripts during JSDOM initialization,
        // by the time this runs, window.contentData and window.openModal should be available.
        // But the script defines them as `const contentData` and `function openModal`,
        // which do NOT get attached to window automatically unless they are var or window.prop.
        // To fix this without brittle brace extraction, we can append a script to the DOM that exposes them!

        const exporterScript = document.createElement('script');
        exporterScript.textContent = `
            window._exposedContentData = contentData;
            window._exposedOpenModal = openModal;
        `;
        document.body.appendChild(exporterScript);

        _openModal = window._exposedOpenModal;
        _contentData = window._exposedContentData;
    });

    beforeEach(() => {
        // Reset modal state manually
        const modal = document.getElementById('service-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        const leftContainer = document.getElementById('modal-left-container');
        if (leftContainer) {
            leftContainer.innerHTML = '';
        }

        const content = document.getElementById('modal-content');
        if (content) {
            content.innerHTML = '';
        }
    });

    it('should return early if type is not found in contentData', () => {
        const modal = document.getElementById('service-modal');
        const content = document.getElementById('modal-content');

        _openModal('invalid_type');

        expect(modal.classList.contains('hidden')).toBe(true);
        expect(content.innerHTML).toBe('');
    });

    it('should populate modal correctly for standard types', () => {
        _openModal('humano');

        const leftContainer = document.getElementById('modal-left-container');
        const content = document.getElementById('modal-content');
        const modal = document.getElementById('service-modal');

        // Check if img was added to left container
        const img = leftContainer.querySelector('img');
        expect(img).not.toBeNull();
        expect(img.getAttribute('src')).toBe(_contentData['humano'].image);
        expect(img.classList.contains('object-contain')).toBe(true);

        // Check content
        expect(content.innerHTML).toContain(_contentData['humano'].title);
        expect(content.innerHTML).toContain(_contentData['humano'].leader);
        expect(content.innerHTML).toContain(_contentData['humano'].role);
        expect(content.innerHTML).toContain(_contentData['humano'].desc);
        expect(content.innerHTML).toContain(_contentData['humano'].list[0]);

        // Check modal visibility
        expect(modal.classList.contains('hidden')).toBe(false);
        expect(modal.classList.contains('flex')).toBe(true);
    });

    it('should use object-cover for types not in specific list', () => {
        // Mock a type not in the specific list (e.g. 'empresas_info')
        _openModal('empresas_info');

        const leftContainer = document.getElementById('modal-left-container');
        const img = leftContainer.querySelector('img');

        expect(img).not.toBeNull();
        expect(img.classList.contains('object-cover')).toBe(true);
    });

    it('should use special logic for filosofia_premium', () => {
        _openModal('filosofia_premium');

        const leftContainer = document.getElementById('modal-left-container');
        const content = document.getElementById('modal-content');
        const modal = document.getElementById('service-modal');

        // Should have special background div
        const bgDiv = leftContainer.querySelector('div.absolute.inset-0');
        expect(bgDiv).not.toBeNull();
        expect(bgDiv.style.backgroundImage).toContain(_contentData['filosofia_premium'].image);

        // Should have the vertical logo
        const logoImg = leftContainer.querySelector('img');
        expect(logoImg).not.toBeNull();
        expect(logoImg.getAttribute('src')).toContain('logo.png');

        // Should contain custom HTML
        expect(content.innerHTML).toContain('Carta a nuestros Clientes');
        expect(content.innerHTML).toContain('Misión');

        // Check modal visibility
        expect(modal.classList.contains('hidden')).toBe(false);
    });
});
