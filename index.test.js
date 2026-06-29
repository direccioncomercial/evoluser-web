const fs = require('fs');
const path = require('path');
const { handleOfficeSubmit } = require('./scripts');

describe('handleOfficeSubmit', () => {
    let locationAssignMock;

    beforeEach(() => {
        // We use a completely fake DOM that avoids any JSDOM overhead for location assigning
        const elements = {};
        global.document = {
            getElementById: jest.fn((id) => {
                if (!elements[id]) {
                    elements[id] = {
                        value: '',
                        classList: {
                            classes: new Set(),
                            add: function(c) { this.classes.add(c); },
                            remove: function(c) { this.classes.delete(c); },
                            contains: function(c) { return this.classes.has(c); }
                        },
                        reset: jest.fn()
                    };
                }
                return elements[id];
            })
        };

        locationAssignMock = jest.fn();
        global.window = {
            location: {
                assign: locationAssignMock
            }
        };
    });

    afterEach(() => {
        delete global.document;
        delete global.window;
    });

    test('should return early if required fields are missing', () => {
        const event = { preventDefault: jest.fn() };
        handleOfficeSubmit(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(locationAssignMock).not.toHaveBeenCalled();
    });

    test('should prevent default, update location, and toggle visibility when valid', () => {
        global.document.getElementById('ov-id').value = '12345';
        global.document.getElementById('ov-phone').value = '555-1234';
        global.document.getElementById('ov-city').value = 'Test City';
        global.document.getElementById('ov-message').value = 'Test Message';

        const event = { preventDefault: jest.fn() };
        handleOfficeSubmit(event);

        expect(event.preventDefault).toHaveBeenCalled();

        const expectedBody = encodeURIComponent(`ID: 12345\nTel: 555-1234\nCiudad: Test City\n\nMensaje:\nTest Message`);
        expect(locationAssignMock).toHaveBeenCalledWith(`mailto:evoluserec@gmail.com?subject=Solicitud Oficina Virtual&body=${expectedBody}`);

        expect(global.document.getElementById('ov-form').classList.contains('hidden')).toBe(true);
        expect(global.document.getElementById('ov-success').classList.contains('hidden')).toBe(false);
    });
});
