const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

describe('setSegment', () => {
    let window;
    let document;

    beforeEach(() => {
        // We use JSDOM to parse the HTML to easily extract the script contents
        const dom = new JSDOM(html);
        document = dom.window.document;
        window = dom.window;

        // Mock window.scrollTo
        window.scrollTo = jest.fn();

        // Extract script content containing setSegment
        const scripts = Array.from(document.querySelectorAll('script'));
        const scriptWithSetSegment = scripts.find(s => s.textContent.includes('function setSegment('));

        if (scriptWithSetSegment) {
            const blockStart = scriptWithSetSegment.textContent.indexOf('function setSegment(');
            const block = scriptWithSetSegment.textContent.substring(blockStart);
            let openBraces = 0;
            let endIdx = -1;
            for (let i = block.indexOf('{'); i < block.length; i++) {
                if (block[i] === '{') openBraces++;
                else if (block[i] === '}') {
                    openBraces--;
                    if (openBraces === 0) {
                        endIdx = i;
                        break;
                    }
                }
            }
            if (endIdx !== -1) {
                const funcStr = block.substring(0, endIdx + 1);
                window.setSegment = new Function(`
                    return function(segment) {
                        const document = this.document;
                        const window = this;
                        ${funcStr.replace(/function setSegment\s*\([^)]*\)\s*\{/, '').replace(/\}$/, '')}
                    }
                `)().bind(window);
            }
        }

        // Ensure our DOM is set up with the necessary elements
        // The HTML from index.html already has these, but let's make sure
        // we start in a clean state for the test
        document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
        ['soluciones', 'empresas', 'emprendedores', 'oficina'].forEach(s => {
            const el = document.getElementById('segment-' + s);
            if(el) el.classList.add('hidden');
        });

        // Set 'soluciones' as the active one initially
        const navSol = document.getElementById('nav-soluciones');
        if (navSol) navSol.classList.add('active');
        const segSol = document.getElementById('segment-soluciones');
        if (segSol) segSol.classList.remove('hidden');
    });

    test('should activate specified segment and hide others', () => {
        // Test with "empresas"
        window.setSegment('empresas');

        expect(document.getElementById('nav-empresas').classList.contains('active')).toBe(true);
        expect(document.getElementById('segment-empresas').classList.contains('hidden')).toBe(false);

        expect(document.getElementById('nav-soluciones').classList.contains('active')).toBe(false);
        expect(document.getElementById('segment-soluciones').classList.contains('hidden')).toBe(true);

        // other segments should also be hidden
        expect(document.getElementById('segment-emprendedores').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('segment-oficina').classList.contains('hidden')).toBe(true);

        expect(window.scrollTo).toHaveBeenCalledWith({top: 0, behavior: 'smooth'});
    });

    test('should handle missing elements gracefully', () => {
        // Test with a segment that doesn't have a nav or segment element
        expect(() => {
            window.setSegment('nonexistent');
        }).not.toThrow();

        expect(window.scrollTo).toHaveBeenCalledWith({top: 0, behavior: 'smooth'});
    });
});
