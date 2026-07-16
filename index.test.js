const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

describe('openModal functionality', () => {
  let dom;
  let window;
  let document;

  beforeAll(() => {
     jest.useFakeTimers();
  });

  afterAll(() => {
     jest.useRealTimers();
  });

  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    window = dom.window;
    document = window.document;

    // override TextEncoder since JSDOM might not have it properly setup for scripts
    window.TextEncoder = TextEncoder;
    window.TextDecoder = TextDecoder;

    // We override console.error to swallow the expected JSDOM errors about split.
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
      console.error.mockRestore();
  });

  test('should do nothing if content type does not exist', () => {
    const modalContent = document.getElementById('modal-content');
    const initialHTML = modalContent ? modalContent.innerHTML : null;

    // Check undefined type
    window.openModal('undefined_type');

    // If modalContent doesn't exist initially, it shouldn't exist after
    if (modalContent) {
        expect(modalContent.innerHTML).toBe(initialHTML);
    }
  });

  test('should populate modal correctly for a standard type', () => {
    window.openModal('humano');

    const container = document.getElementById('modal-left-container');
    const modalContent = document.getElementById('modal-content');
    const serviceModal = document.getElementById('service-modal');

    expect(container.innerHTML).toContain('<img id="modal-image" src="https://raw.githubusercontent.com/direccioncomercial/evoluser-web/1b862973e8003850daadd6a47bffd5b6cf04b2f6/imagen2.png"');
    expect(modalContent.innerHTML).toContain('Gestión de Talento');
    expect(serviceModal.classList.contains('hidden')).toBe(false);
    expect(serviceModal.classList.contains('flex')).toBe(true);
  });

  test('should apply special logic for filosofia_premium', () => {
    window.openModal('filosofia_premium');

    const container = document.getElementById('modal-left-container');
    const modalContent = document.getElementById('modal-content');

    expect(container.innerHTML).toContain('opacity-20');
    // jsdom escapes the & symbol in the innerHTML to &amp;
    expect(container.innerHTML).toContain('url(\'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&amp;fit=crop&amp;w=800&amp;q=80\')');
    expect(container.innerHTML).toContain('logo.png');

    expect(modalContent.innerHTML).toContain('Filosofía EvoluSer');
    expect(modalContent.innerHTML).toContain('Carta a nuestros Clientes');
  });
});
