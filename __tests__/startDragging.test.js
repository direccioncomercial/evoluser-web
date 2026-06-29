/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('startDragging function', () => {
    beforeEach(() => {
        // Reset DOM
        document.documentElement.innerHTML = html.toString();

        // Define missing TextEncoder and TextDecoder in jsdom
        const { TextEncoder, TextDecoder } = require('util');
        global.TextEncoder = TextEncoder;
        global.TextDecoder = TextDecoder;
    });

    test('should set initial state and coordinates', () => {
        let match;
        const scripts = html.match(/<script.*?>([\s\S]*?)<\/script>/g);
        if (scripts) {
          scripts.forEach((s) => {
            if (s.includes("function startDragging")) {
              const content = s.replace(/<script.*?>|<\/script>/g, "");
              // Since startDragging is defined as a one-liner before drag(),
              // we can robustly extract it.
              const regex = /function startDragging\(e\)\s*\{([^}]*)\}/;
              match = content.match(regex);
            }
          });
        }

        // Create isolated environment variables
        window.isDragging = false;
        window.hasMoved = false;
        window.startX = 0;
        window.startY = 0;
        window.initialX = 0;
        window.initialY = 0;

        window.evContainer = { offsetLeft: 50, offsetTop: 60 };

        const mockEvent = {
            clientX: 100,
            clientY: 200
        };

        const functionBody = match[1]
            .replace(/isDragging/g, 'window.isDragging')
            .replace(/hasMoved/g, 'window.hasMoved')
            .replace(/startX/g, 'window.startX')
            .replace(/startY/g, 'window.startY')
            .replace(/initialX/g, 'window.initialX')
            .replace(/initialY/g, 'window.initialY')
            .replace(/evContainer/g, 'window.evContainer');

        const boundStartDragging = new Function('e', functionBody);

        boundStartDragging(mockEvent);

        expect(window.isDragging).toBe(true);
        expect(window.hasMoved).toBe(false);
        expect(window.startX).toBe(100);
        expect(window.startY).toBe(200);
        expect(window.initialX).toBe(50);
        expect(window.initialY).toBe(60);
    });
});
