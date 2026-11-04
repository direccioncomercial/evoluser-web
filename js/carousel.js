let currentSlide = 0;
let slides = [];
let totalSlides = 0;
let carouselInterval = null;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

function initCarousel() {
    slides = document.querySelectorAll('.carousel-slide');
    totalSlides = slides.length;
    currentSlide = 0; // Reset state for testing

    // Auto-play opcional (comenta esta línea si prefieres solo manual)
    if (totalSlides > 0) {
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
        carouselInterval = setInterval(nextSlide, 6000);
    }
}

// Expose to window for inline handlers
if (typeof window !== 'undefined') {
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.showSlide = showSlide;
    window.initCarousel = initCarousel;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initCarousel, nextSlide, prevSlide, showSlide };
}
