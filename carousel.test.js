const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Carousel Logic', () => {
    let window;
    let document;

    beforeEach((done) => {
        jest.useFakeTimers();

        const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

        // Extract script content to execute it in the JSDOM context securely
        const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
        let scripts = '';
        let match;
        while ((match = scriptRegex.exec(html)) !== null) {
            scripts += match[1] + '\n';
        }

        // We override setInterval to prevent it from hanging during tests
        const modifiedScripts = scripts.replace(/setInterval\((.*?),\s*(.*?)\);/g, 'window.mockSetInterval = function() { setInterval($1, $2); };');

        const dom = new JSDOM(html, {
            runScripts: "outside-only",
        });

        window = dom.window;
        document = window.document;

        // Polyfill features for JSDOM
        window.HTMLFormElement.prototype.requestSubmit = function() {};

        // The slogan element causes a split error because innerText is not fully supported in JSDOM the same way,
        // we set textContent to fix it
        const slogan = document.getElementById('slogan-animado');
        if (slogan) {
            slogan.innerText = slogan.textContent;
        }

        // Execute the script manually on the window context
        try {
            window.eval(`
                ${modifiedScripts}
                window.nextSlide = nextSlide;
                window.prevSlide = prevSlide;
                window.getCurrentSlide = function() { return currentSlide; };
                window.setCurrentSlide = function(val) { currentSlide = val; };
                window.getTotalSlides = function() { return totalSlides; };
            `);
        } catch(e) {
            console.error(e);
        }

        // Allow DOM content loaded event listeners to run
        const event = new window.Event('DOMContentLoaded');
        window.document.dispatchEvent(event);

        done();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    describe('nextSlide', () => {
        it('should increment currentSlide and update DOM classes', () => {
            window.setCurrentSlide(0);

            window.nextSlide();

            expect(window.getCurrentSlide()).toBe(1);

            const slides = document.querySelectorAll('.carousel-slide');
            expect(slides[0].classList.contains('active')).toBe(false);
            expect(slides[1].classList.contains('active')).toBe(true);
        });

        it('should wrap around to 0 when currently on the last slide', () => {
            const total = window.getTotalSlides();
            window.setCurrentSlide(total - 1);
            expect(window.getCurrentSlide()).toBe(total - 1); // Verify it's set correctly

            window.nextSlide();

            expect(window.getCurrentSlide()).toBe(0);

            const slides = document.querySelectorAll('.carousel-slide');
            expect(slides[total - 1].classList.contains('active')).toBe(false);
            expect(slides[0].classList.contains('active')).toBe(true);
        });
    });

    describe('prevSlide', () => {
        it('should decrement currentSlide and update DOM classes', () => {
            window.setCurrentSlide(1);

            window.prevSlide();

            expect(window.getCurrentSlide()).toBe(0);

            const slides = document.querySelectorAll('.carousel-slide');
            expect(slides[1].classList.contains('active')).toBe(false);
            expect(slides[0].classList.contains('active')).toBe(true);
        });

        it('should wrap around to the last slide when currently on the first slide', () => {
            window.setCurrentSlide(0);

            window.prevSlide();

            const total = window.getTotalSlides();
            expect(window.getCurrentSlide()).toBe(total - 1); // totalSlides - 1

            const slides = document.querySelectorAll('.carousel-slide');
            expect(slides[0].classList.contains('active')).toBe(false);
            expect(slides[total - 1].classList.contains('active')).toBe(true);
        });
    });
});
