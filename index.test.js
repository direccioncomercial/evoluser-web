const fs = require('fs');
const path = require('path');

describe('handleOfficeSubmit', () => {

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
    document.body.innerHTML = html;

    // Evaluate script block directly
    const scriptMatches = html.match(/<script>([\s\S]*?)<\/script>/g);
    const lastScript = scriptMatches[scriptMatches.length - 1];
    const scriptContent = lastScript.replace(/<\/?script>/g, '');

    // Extract handleOfficeSubmit body and create it explicitly
    const match = scriptContent.match(/function handleOfficeSubmit\(e\) \{([\s\S]*?)\n        \}/);
    if (match) {
      window.handleOfficeSubmit = new Function('e', match[1].replace('window.location.href =', 'window.mockLocationHref ='));
    } else {
      throw new Error("Could not find handleOfficeSubmit body");
    }

    window.mockLocationHref = 'http://localhost/';
  });

  test('should return early when all required fields are empty', () => {
    const event = { preventDefault: jest.fn() };

    document.getElementById('ov-id').value = '';
    document.getElementById('ov-phone').value = '';
    document.getElementById('ov-city').value = '';
    document.getElementById('ov-message').value = '';

    const originalHref = window.mockLocationHref;
    window.handleOfficeSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(window.mockLocationHref).toBe(originalHref);
    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('ov-success').classList.contains('hidden')).toBe(true);
  });

  test('should return early when only id is empty', () => {
    const event = { preventDefault: jest.fn() };

    document.getElementById('ov-id').value = '';
    document.getElementById('ov-phone').value = '123456';
    document.getElementById('ov-city').value = 'City';
    document.getElementById('ov-message').value = 'Msg';

    const originalHref = window.mockLocationHref;
    window.handleOfficeSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(window.mockLocationHref).toBe(originalHref);
    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(false);
  });

  test('should return early when only phone is empty', () => {
    const event = { preventDefault: jest.fn() };

    document.getElementById('ov-id').value = '123';
    document.getElementById('ov-phone').value = '';
    document.getElementById('ov-city').value = 'City';
    document.getElementById('ov-message').value = 'Msg';

    const originalHref = window.mockLocationHref;
    window.handleOfficeSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(window.mockLocationHref).toBe(originalHref);
    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(false);
  });

  test('should return early when only message is empty', () => {
    const event = { preventDefault: jest.fn() };

    document.getElementById('ov-id').value = '123';
    document.getElementById('ov-phone').value = '123456';
    document.getElementById('ov-city').value = 'City';
    document.getElementById('ov-message').value = '';

    const originalHref = window.mockLocationHref;
    window.handleOfficeSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(window.mockLocationHref).toBe(originalHref);
    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(false);
  });

  test('should proceed when all required fields are filled', () => {
    const event = { preventDefault: jest.fn() };

    document.getElementById('ov-id').value = '123';
    document.getElementById('ov-phone').value = '123456';
    document.getElementById('ov-city').value = 'City';
    document.getElementById('ov-message').value = 'Msg';

    const originalHref = window.mockLocationHref;
    window.handleOfficeSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(window.mockLocationHref).not.toBe(originalHref);
    expect(window.mockLocationHref).toContain('mailto:evoluserec@gmail.com');
    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('ov-success').classList.contains('hidden')).toBe(false);
  });
});
