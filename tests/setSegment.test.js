/** @jest-environment jsdom */
const { setSegment } = require('../js/setSegment.js');

describe('setSegment functionality', () => {
    beforeEach(() => {
        // Set up the JSDOM document before each test
        document.body.innerHTML = `
            <div>
                <button id="nav-soluciones" class="nav-link active">Soluciones</button>
                <button id="nav-empresas" class="nav-link">Empresas</button>
                <button id="nav-emprendedores" class="nav-link">Emprendedores</button>
                <button id="nav-oficina" class="nav-link">Oficina</button>
            </div>
            <div>
                <div id="segment-soluciones" class=""></div>
                <div id="segment-empresas" class="hidden"></div>
                <div id="segment-emprendedores" class="hidden"></div>
                <div id="segment-oficina" class="hidden"></div>
            </div>
        `;

        // Mock window.scrollTo since it's not implemented in JSDOM
        window.scrollTo = jest.fn();
    });

    test('should activate the correct navigation link and deactivate others', () => {
        setSegment('empresas');

        expect(document.getElementById('nav-empresas').classList.contains('active')).toBe(true);
        expect(document.getElementById('nav-soluciones').classList.contains('active')).toBe(false);
        expect(document.getElementById('nav-emprendedores').classList.contains('active')).toBe(false);
        expect(document.getElementById('nav-oficina').classList.contains('active')).toBe(false);
    });

    test('should show the correct segment and hide others', () => {
        setSegment('emprendedores');

        expect(document.getElementById('segment-emprendedores').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('segment-soluciones').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('segment-empresas').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('segment-oficina').classList.contains('hidden')).toBe(true);
    });

    test('should scroll to the top of the page', () => {
        setSegment('oficina');

        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    test('should handle missing navigation link gracefully', () => {
        // Remove one navigation link
        document.getElementById('nav-empresas').remove();

        // Calling it shouldn't throw an error even though nav-empresas doesn't exist
        expect(() => {
            setSegment('empresas');
        }).not.toThrow();

        expect(document.getElementById('segment-empresas').classList.contains('hidden')).toBe(false);
    });

    test('should handle missing target segment gracefully', () => {
        // Remove a target segment
        document.getElementById('segment-emprendedores').remove();

        // Calling it shouldn't throw an error
        expect(() => {
            setSegment('emprendedores');
        }).not.toThrow();

        expect(document.getElementById('nav-emprendedores').classList.contains('active')).toBe(true);
    });
});
