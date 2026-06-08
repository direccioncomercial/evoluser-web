const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

describe('setSegment function', () => {
    let dom;
    let window;
    let document;

    beforeEach((done) => {
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        const virtualConsole = new VirtualConsole();
        virtualConsole.on("error", () => { /* No-op to avoid logging external resource errors */ });
        virtualConsole.on("jsdomError", () => { /* No-op */ });

        dom = new JSDOM(html, {
            runScripts: 'dangerously',
            virtualConsole
        });

        window = dom.window;
        document = window.document;

        // Mock window.scrollTo
        window.scrollTo = jest.fn();

        window.addEventListener('load', () => {
            done();
        });
    });

    it('should exist on the window object', () => {
        expect(typeof window.setSegment).toBe('function');
    });

    it('should set active class on correct nav link and remove from others', () => {
        // Initial setup - fake another active class
        const prevActive = document.getElementById('nav-empresas');
        if (prevActive) prevActive.classList.add('active');

        window.setSegment('soluciones');

        // Nav link for 'soluciones' should have active class
        const activeNav = document.getElementById('nav-soluciones');
        expect(activeNav.classList.contains('active')).toBe(true);

        // Other nav links should not have active class
        const otherNavs = ['empresas', 'emprendedores', 'oficina'];
        otherNavs.forEach(navId => {
            const nav = document.getElementById(`nav-${navId}`);
            if (nav) {
                expect(nav.classList.contains('active')).toBe(false);
            }
        });
    });

    it('should show correct segment content and hide others', () => {
        // Initial setup - fake another visible segment
        const prevVisible = document.getElementById('segment-empresas');
        if (prevVisible) prevVisible.classList.remove('hidden');

        window.setSegment('soluciones');

        // Segment for 'soluciones' should not have hidden class
        const targetSegment = document.getElementById('segment-soluciones');
        expect(targetSegment.classList.contains('hidden')).toBe(false);

        // Other segments should have hidden class
        const otherSegments = ['empresas', 'emprendedores', 'oficina'];
        otherSegments.forEach(segmentId => {
            const segment = document.getElementById(`segment-${segmentId}`);
            if (segment) {
                expect(segment.classList.contains('hidden')).toBe(true);
            }
        });
    });

    it('should call window.scrollTo with smooth behavior to top 0', () => {
        window.setSegment('soluciones');

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth'
        });
    });

    it('should handle non-existent segments without throwing errors', () => {
        expect(() => {
            window.setSegment('non-existent-segment');
        }).not.toThrow();

        // Should still call scrollTo
        expect(window.scrollTo).toHaveBeenCalled();

        // Should still hide all existing segments
        const segments = ['soluciones', 'empresas', 'emprendedores', 'oficina'];
        segments.forEach(segmentId => {
            const segment = document.getElementById(`segment-${segmentId}`);
            if (segment) {
                expect(segment.classList.contains('hidden')).toBe(true);
            }
        });

        // Should remove active from all nav links
        segments.forEach(navId => {
            const nav = document.getElementById(`nav-${navId}`);
            if (nav) {
                expect(nav.classList.contains('active')).toBe(false);
            }
        });
    });
});
