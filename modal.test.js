/** @jest-environment jsdom */

const fs = require('fs');
const path = require('path');

describe('Modal functionality', () => {
    let originalConsoleError;

    beforeAll(() => {
        originalConsoleError = console.error;
        console.error = jest.fn(); // Swallow expected JSDOM internal errors

        // Polyfill missing JSDOM functions if needed
        window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
        window.cancelAnimationFrame = (id) => clearTimeout(id);

        const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
        document.body.innerHTML = html;
        const scripts = document.querySelectorAll('script');

        let targetScript = null;
        for (const script of scripts) {
            if (script.innerHTML.includes('function openModal')) {
                targetScript = script.innerHTML;
                break;
            }
        }

        if (targetScript) {
            window.eval(targetScript);
        }
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    beforeEach(() => {
        // Reset modal state before each test
        const serviceModal = document.getElementById('service-modal');
        serviceModal.classList.add('hidden');
        serviceModal.classList.remove('flex');

        document.getElementById('modal-left-container').innerHTML = '';
        document.getElementById('modal-content').innerHTML = '';
    });

    it('should not open modal for unknown type', () => {
        window.openModal('unknown_type');

        const serviceModal = document.getElementById('service-modal');
        expect(serviceModal.classList.contains('hidden')).toBe(true);
        expect(serviceModal.classList.contains('flex')).toBe(false);
    });

    it('should render special layout for filosofia_premium', () => {
        window.openModal('filosofia_premium');

        const serviceModal = document.getElementById('service-modal');
        expect(serviceModal.classList.contains('hidden')).toBe(false);
        expect(serviceModal.classList.contains('flex')).toBe(true);

        const container = document.getElementById('modal-left-container');
        expect(container.innerHTML).toContain('logo.png');
        expect(container.innerHTML).toContain('transform -rotate-90');
        expect(container.innerHTML).toContain('EvoluSer Vertical');
    });

    it('should render correct img class for humano (object-contain bg-gray-50)', () => {
        window.openModal('humano');

        const container = document.getElementById('modal-left-container');
        const img = container.querySelector('#modal-image');
        expect(img).not.toBeNull();
        expect(img.getAttribute('src')).toBe('https://raw.githubusercontent.com/direccioncomercial/evoluser-web/1b862973e8003850daadd6a47bffd5b6cf04b2f6/imagen2.png');
        expect(img.className).toContain('object-contain bg-gray-50');

        const content = document.getElementById('modal-content');
        expect(content.innerHTML).toContain('Gestión de Talento');
        expect(content.innerHTML).toContain('Nury Echeverria');
        expect(content.innerHTML).toContain('Directora de Talento');
        expect(content.innerHTML).toContain('Potenciamos el capital humano con diagnósticos precisos.');
        expect(content.innerHTML).toContain('Reclutamiento Senior');
    });

    it('should render correct img class for empresas_info (object-cover object-top)', () => {
        window.openModal('empresas_info');

        const container = document.getElementById('modal-left-container');
        const img = container.querySelector('#modal-image');
        expect(img).not.toBeNull();
        expect(img.className).toContain('object-cover object-top');
        expect(img.className).not.toContain('bg-gray-50');

        const content = document.getElementById('modal-content');
        expect(content.innerHTML).toContain('Consultoría 360°');
        expect(content.innerHTML).toContain('Soluciones corporativas de alto impacto estratégico.');
        expect(content.innerHTML).toContain('Outsourcing RRHH');
    });
});
