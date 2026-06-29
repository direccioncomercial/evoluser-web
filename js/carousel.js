let currentSlide = 0;
let slides;
let totalSlides;

function initCarousel() {
    slides = document.querySelectorAll('.carousel-slide');
    totalSlides = slides.length;
}

function showSlide(index) {
    if (!slides) return;
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initCarousel, showSlide, nextSlide, prevSlide };
}
