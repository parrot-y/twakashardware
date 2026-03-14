/**
 * Hero Section — Cinematic Video + Image Carousel
 * Handles crossfade between video and image slides.
 * Videos auto-play when active and pause when inactive.
 */

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero-bg-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');

    if (!slides.length) return;

    const slideContainer = document.getElementById('heroSlides');
    let currentIndex = 0;
    let intervalId;
    const INTERVAL = 3000; // 3 seconds per slide for faster shuffling

    function handleVideoState(slide, shouldPlay) {
        const video = slide.querySelector('video');
        if (!video) return;
        if (shouldPlay) {
            video.currentTime = 0;
            video.play().catch(() => { });
        } else {
            video.pause();
        }
    }

    function showSlide(index) {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        currentIndex = index;

        // Move the container
        if (slideContainer) {
            slideContainer.style.transform = `translateX(-${currentIndex * (100 / slides.length)}%)`;
        }

        // Handle active classes for dots and animations
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            handleVideoState(slide, false);
            if (i === currentIndex) {
                slide.classList.add('active');
                handleVideoState(slide, true);
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === currentIndex) dot.classList.add('active');
        });
    }

    function nextSlide() { showSlide(currentIndex + 1); }
    function prevSlide() { showSlide(currentIndex - 1); }

    function startAutoPlay() {
        stopAutoPlay();
        intervalId = setInterval(nextSlide, INTERVAL);
    }

    function stopAutoPlay() {
        if (intervalId) clearInterval(intervalId);
    }

    // Dot clicks
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoPlay();
            showSlide(parseInt(dot.dataset.slide, 10));
            startAutoPlay();
        });
    });

    // Arrow clicks
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        });
    }

    // Pause carousel on hover
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoPlay);
        heroSection.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch swipe support
    let touchStartX = 0;
    if (heroSection) {
        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroSection.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                stopAutoPlay();
                if (diff > 0) nextSlide(); else prevSlide();
                startAutoPlay();
            }
        }, { passive: true });
    }

    // Ensure the first video plays on load
    handleVideoState(slides[0], true);

    // Start auto-rotation
    startAutoPlay();
});
