const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('openModal functionality', () => {
  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = '';

    // Create the necessary DOM elements for testing
    document.body.innerHTML = `
      <div id="modal-left-container"></div>
      <div id="service-modal" class="hidden"></div>
      <div id="modal-content"></div>
    `;

    const contentDataMatch = html.match(/(const contentData = \{[\s\S]*?\n        \};)/);
    const openModalMatch = html.match(/(function openModal\(type\) \{[\s\S]*?\n        \})/);

    if (contentDataMatch && openModalMatch) {
      // By wrapping in window.eval, variables are assigned to window/global scope
      window.eval(contentDataMatch[1] + "\n" + openModalMatch[1] + "\nwindow.contentData = contentData;\nwindow.openModal = openModal;");
      global.contentData = window.contentData;
      global.openModal = window.openModal;
    } else {
      throw new Error("Could not parse contentData or openModal from index.html");
    }
  });

  afterEach(() => {
    delete global.contentData;
    delete global.openModal;
  });

  test('renders special logic for filosofia_premium', () => {
    openModal('filosofia_premium');

    const container = document.getElementById('modal-left-container');
    expect(container.innerHTML).toContain('logo.png');
    expect(container.innerHTML).toContain('absolute inset-0 bg-cover bg-center opacity-20');
    expect(container.innerHTML).not.toContain('<img id="modal-image"');

    // Test that the #modal-content is populated with customHTML
    const content = document.getElementById('modal-content');
    expect(content.innerHTML).toContain('Filosofía EvoluSer');
    expect(content.innerHTML).toContain('Carta a nuestros Clientes');
  });

  test('renders standard logic with specific class for target array', () => {
    openModal('equipo');

    const container = document.getElementById('modal-left-container');
    const img = container.querySelector('#modal-image');
    expect(img).not.toBeNull();
    expect(img.className).toContain('object-contain bg-gray-50');
  });

  test('renders standard logic with default class for non-target array', () => {
    openModal('empresas_info');

    const container = document.getElementById('modal-left-container');
    const img = container.querySelector('#modal-image');
    expect(img).not.toBeNull();
    expect(img.className).toContain('object-cover object-top');
  });

  test('does nothing for invalid type', () => {
    const container = document.getElementById('modal-left-container');
    container.innerHTML = 'Original';

    openModal('invalid_type');

    expect(container.innerHTML).toBe('Original');
  });

  test('populates #modal-content with title, leader, role, desc and list', () => {
    openModal('humano');

    const content = document.getElementById('modal-content');

    // Title
    expect(content.innerHTML).toContain('Gestión de Talento');
    // Leader & Role
    expect(content.innerHTML).toContain('Nury Echeverria');
    expect(content.innerHTML).toContain('Directora de Talento');
    // Desc
    expect(content.innerHTML).toContain('Potenciamos el capital humano con diagnósticos precisos.');
    // List
    expect(content.innerHTML).toContain('Reclutamiento Senior');
    expect(content.innerHTML).toContain('Cultura de Éxito');
    expect(content.innerHTML).toContain('Evaluación 360°');
  });

  test('toggles service-modal classes to make it visible', () => {
    const modal = document.getElementById('service-modal');

    // Verify initial state
    expect(modal.classList.contains('hidden')).toBe(true);
    expect(modal.classList.contains('flex')).toBe(false);

    openModal('humano');

    // Verify state after opening
    expect(modal.classList.contains('hidden')).toBe(false);
    expect(modal.classList.contains('flex')).toBe(true);
  });
});
