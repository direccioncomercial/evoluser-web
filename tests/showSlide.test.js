const fs = require('fs');
const path = require('path');
const { initCarousel, showSlide } = require('../js/carousel');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('showSlide function', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html;
        initCarousel();
    });

    test('should correctly add "active" class to specified index and remove from others', () => {
        const slides = document.querySelectorAll('.carousel-slide');
        expect(slides.length).toBeGreaterThan(1);

        // Ensure initial state
        slides.forEach(s => s.classList.remove('active'));
        slides[0].classList.add('active');

        expect(slides[0].classList.contains('active')).toBe(true);
        expect(slides[1].classList.contains('active')).toBe(false);
        expect(slides[2].classList.contains('active')).toBe(false);

        // Call the function for index 2
        showSlide(2);

        // Verify results
        expect(slides[0].classList.contains('active')).toBe(false);
        expect(slides[1].classList.contains('active')).toBe(false);
        expect(slides[2].classList.contains('active')).toBe(true);

        // Call the function for index 1
        showSlide(1);

        // Verify results
        expect(slides[0].classList.contains('active')).toBe(false);
        expect(slides[1].classList.contains('active')).toBe(true);
        expect(slides[2].classList.contains('active')).toBe(false);
    });

    test('should handle out of bounds index safely (removes active from all)', () => {
        const slides = document.querySelectorAll('.carousel-slide');
        slides[0].classList.add('active');

        // Call with an invalid index
        showSlide(999);

        // Ensure no slide is active
        const hasActive = Array.from(slides).some(s => s.classList.contains('active'));
        expect(hasActive).toBe(false);
    });
});
