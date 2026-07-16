const { setSegment } = require('./navigation');

describe('setSegment', () => {
    let scrollToMock;

    beforeEach(() => {
        // Mock window.scrollTo
        scrollToMock = jest.fn();
        window.scrollTo = scrollToMock;

        // Set up DOM
        document.body.innerHTML = `
            <div>
                <button class="nav-link active" id="nav-soluciones">Soluciones</button>
                <button class="nav-link" id="nav-empresas">Empresas</button>
                <button class="nav-link" id="nav-emprendedores">Emprendedores</button>
                <button class="nav-link" id="nav-oficina">Oficina</button>
            </div>
            <div>
                <div id="segment-soluciones">Soluciones Content</div>
                <div id="segment-empresas" class="hidden">Empresas Content</div>
                <div id="segment-emprendedores" class="hidden">Emprendedores Content</div>
                <div id="segment-oficina" class="hidden">Oficina Content</div>
            </div>
        `;
    });

    afterEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });

    it('should set active class on target nav link and remove from others', () => {
        setSegment('empresas');

        expect(document.getElementById('nav-empresas').classList.contains('active')).toBe(true);
        expect(document.getElementById('nav-soluciones').classList.contains('active')).toBe(false);
        expect(document.getElementById('nav-emprendedores').classList.contains('active')).toBe(false);
        expect(document.getElementById('nav-oficina').classList.contains('active')).toBe(false);
    });

    it('should remove hidden class from target segment and add to others', () => {
        setSegment('empresas');

        expect(document.getElementById('segment-empresas').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('segment-soluciones').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('segment-emprendedores').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('segment-oficina').classList.contains('hidden')).toBe(true);
    });

    it('should call window.scrollTo with correct arguments', () => {
        setSegment('empresas');

        expect(scrollToMock).toHaveBeenCalledTimes(1);
        expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('should not throw error if segment ID does not exist', () => {
        expect(() => {
            setSegment('non-existent');
        }).not.toThrow();

        // Check if all known navs are not active and all known segments are hidden
        expect(document.getElementById('nav-soluciones').classList.contains('active')).toBe(false);
        expect(document.getElementById('segment-soluciones').classList.contains('hidden')).toBe(true);

        expect(scrollToMock).toHaveBeenCalledTimes(1);
        expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
});
