const { handleOfficeSubmit } = require('./handleOfficeSubmit');

describe('handleOfficeSubmit', () => {
  let eventMock;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <form id="ov-form">
        <input id="ov-id" value="123" />
        <input id="ov-phone" value="555-1234" />
        <input id="ov-city" value="Madrid" />
        <textarea id="ov-message">Hello</textarea>
        <div id="ov-success" class="hidden">Success</div>
      </form>
    `;

    // Mock event
    eventMock = { preventDefault: jest.fn() };

    // Mock location setting logic
    window._setLocationHref = jest.fn();
  });

  afterEach(() => {
    delete window._setLocationHref;
    jest.clearAllMocks();
  });

  test('prevents default form submission', () => {
    handleOfficeSubmit(eventMock);
    expect(eventMock.preventDefault).toHaveBeenCalled();
  });

  test('does nothing if id is missing', () => {
    document.getElementById('ov-id').value = '';
    handleOfficeSubmit(eventMock);
    expect(window._setLocationHref).not.toHaveBeenCalled();
    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(false);
  });

  test('does nothing if phone is missing', () => {
    document.getElementById('ov-phone').value = '';
    handleOfficeSubmit(eventMock);
    expect(window._setLocationHref).not.toHaveBeenCalled();
    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(false);
  });

  test('does nothing if message is missing', () => {
    document.getElementById('ov-message').value = '';
    handleOfficeSubmit(eventMock);
    expect(window._setLocationHref).not.toHaveBeenCalled();
    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(false);
  });

  test('sends email and shows success on valid input', () => {
    handleOfficeSubmit(eventMock);

    const expectedBody = encodeURIComponent(`ID: 123\nTel: 555-1234\nCiudad: Madrid\n\nMensaje:\nHello`);
    expect(window._setLocationHref).toHaveBeenCalledWith(`mailto:evoluserec@gmail.com?subject=Solicitud Oficina Virtual&body=${expectedBody}`);

    expect(document.getElementById('ov-form').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('ov-success').classList.contains('hidden')).toBe(false);
  });

  test('handles missing city (city is optional)', () => {
    document.getElementById('ov-city').value = '';
    handleOfficeSubmit(eventMock);

    const expectedBody = encodeURIComponent(`ID: 123\nTel: 555-1234\nCiudad: \n\nMensaje:\nHello`);
    expect(window._setLocationHref).toHaveBeenCalledWith(`mailto:evoluserec@gmail.com?subject=Solicitud Oficina Virtual&body=${expectedBody}`);
  });
});
