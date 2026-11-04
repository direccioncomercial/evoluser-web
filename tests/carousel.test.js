/** @jest-environment jsdom */

const { initCarousel, nextSlide, prevSlide, showSlide } = require('../js/carousel');

describe('Carousel Logic', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="carousel-slides">
                <div class="carousel-slide active">Slide 1</div>
                <div class="carousel-slide">Slide 2</div>
                <div class="carousel-slide">Slide 3</div>
            </div>
        `;
        jest.useFakeTimers();
        initCarousel();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('nextSlide advances to the next slide', () => {
        const slides = document.querySelectorAll('.carousel-slide');

        // Starts at 0
        expect(slides[0].classList.contains('active')).toBe(true);
        expect(slides[1].classList.contains('active')).toBe(false);

        nextSlide();

        // Advances to 1
        expect(slides[0].classList.contains('active')).toBe(false);
        expect(slides[1].classList.contains('active')).toBe(true);
        expect(slides[2].classList.contains('active')).toBe(false);
    });

    test('nextSlide wraps around to the first slide', () => {
        const slides = document.querySelectorAll('.carousel-slide');

        nextSlide(); // index 1
        nextSlide(); // index 2

        expect(slides[2].classList.contains('active')).toBe(true);

        nextSlide(); // wraps to 0

        expect(slides[0].classList.contains('active')).toBe(true);
        expect(slides[1].classList.contains('active')).toBe(false);
        expect(slides[2].classList.contains('active')).toBe(false);
    });

    test('prevSlide goes back to the previous slide', () => {
        const slides = document.querySelectorAll('.carousel-slide');

        nextSlide(); // index 1
        expect(slides[1].classList.contains('active')).toBe(true);

        prevSlide(); // index 0

        expect(slides[0].classList.contains('active')).toBe(true);
        expect(slides[1].classList.contains('active')).toBe(false);
    });

    test('prevSlide wraps around to the last slide', () => {
        const slides = document.querySelectorAll('.carousel-slide');

        // Starts at 0, prev should wrap to 2
        prevSlide();

        expect(slides[0].classList.contains('active')).toBe(false);
        expect(slides[1].classList.contains('active')).toBe(false);
        expect(slides[2].classList.contains('active')).toBe(true);
    });

    test('initCarousel sets up auto-play', () => {
        const slides = document.querySelectorAll('.carousel-slide');
        expect(slides[0].classList.contains('active')).toBe(true);

        // Advance 6000ms
        jest.advanceTimersByTime(6000);

        // Should have advanced to slide 2 (index 1)
        expect(slides[0].classList.contains('active')).toBe(false);
        expect(slides[1].classList.contains('active')).toBe(true);
    });
});
