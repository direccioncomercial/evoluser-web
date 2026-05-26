/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('handleOfficeSubmit', () => {
  beforeAll(() => {
    const htmlContent = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
    // Extract the function handleOfficeSubmit
    const scriptMatch = htmlContent.match(/function handleOfficeSubmit\(e\) \{[\s\S]*?\n        \}/);
    if (scriptMatch) {
      // In order to properly test window.location.href in jsdom without throwing errors
      // about unimplemented navigation, we mock the specific behavior for the test.
      // Since JSDOM prevents overriding `window.location.href` simply, we intercept the
      // function string to use our mock for testing purposes.
      let script = scriptMatch[0].replace('window.location.href =', 'global.mockLocationHref =');
      eval(script + '\n window.handleOfficeSubmit = handleOfficeSubmit;');
    } else {
      throw new Error('Could not find handleOfficeSubmit in index.html');
    }
  });

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="ov-form">
        <input id="ov-id" value="12345" />
        <input id="ov-phone" value="0987654321" />
        <input id="ov-city" value="Quito" />
        <textarea id="ov-message">Test message</textarea>
      </form>
      <div id="ov-success" class="hidden"></div>
    `;
    global.mockLocationHref = '';
  });

  test('should set window.location.href and show success message on valid submission', () => {
    const mockEvent = { preventDefault: jest.fn() };

    window.handleOfficeSubmit(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    const expectedBody = encodeURIComponent(`ID: 12345\nTel: 0987654321\nCiudad: Quito\n\nMensaje:\nTest message`);
    expect(global.mockLocationHref).toBe(`mailto:evoluserec@gmail.com?subject=Solicitud Oficina Virtual&body=${expectedBody}`);

    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('ov-success').classList.contains('hidden')).toBe(false);
  });

  test('should return early if required fields are missing', () => {
    document.getElementById('ov-id').value = '';
    const mockEvent = { preventDefault: jest.fn() };

    window.handleOfficeSubmit(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(global.mockLocationHref).toBe('');
    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(false);
  });

  test('should return early if phone is missing', () => {
    document.getElementById('ov-phone').value = '';
    const mockEvent = { preventDefault: jest.fn() };

    window.handleOfficeSubmit(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(global.mockLocationHref).toBe('');
    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(false);
  });

  test('should return early if message is missing', () => {
    document.getElementById('ov-message').value = '';
    const mockEvent = { preventDefault: jest.fn() };

    window.handleOfficeSubmit(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(global.mockLocationHref).toBe('');
    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(false);
  });
});
