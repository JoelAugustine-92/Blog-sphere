const carousel = document.querySelector('.carousel');
const track = document.querySelector('.track');
const posts = document.querySelectorAll('.post');
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');

let index = 0;
let postWidth = 0;
let visiblePosts = 0;
let autoPlayInterval;

// Calculate how many posts fit in the viewable area and the exact width per slide
function calculateDimensions() {
    visiblePosts = Math.round(carousel.offsetWidth / (posts[0].offsetWidth + 20)); // +20 for gap
    postWidth = posts[0].offsetWidth + 20; // width + gap
}

function updateTransform() {
    track.style.transform = `translateX(${-index * postWidth}px)`;
}

// Seamless reset when reaching duplicates
function checkBounds() {
    const totalOriginal = posts.length / 2; // because we duplicated

    if (index >= totalOriginal) {
        track.style.transition = 'none';
        index = 0;
        updateTransform();
        // Force reflow to apply the instant jump
        void track.offsetWidth;
        track.style.transition = '0.3s linear';
    } else if (index < 0) {
        track.style.transition = 'none';
        index = totalOriginal - 1;
        updateTransform();
        void track.offsetWidth;
        track.style.transition = '0.3s linear';
    }
}

function nextSlide() {
    index++;
    updateTransform();

    // After transition ends, check if we need to reset for seamless loop
    track.addEventListener('transitionend', checkBounds, { once: true });
}

function prevSlide() {
    index--;
    updateTransform();

    track.addEventListener('transitionend', checkBounds, { once: true });
}

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 3000); // Change every 3 seconds
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Initial setup
calculateDimensions();
updateTransform();
startAutoPlay();

// Arrow clicks
rightArrow.addEventListener('click', () => {
    stopAutoPlay();
    nextSlide();
    startAutoPlay();
});

leftArrow.addEventListener('click', () => {
    stopAutoPlay();
    prevSlide();
    startAutoPlay();
});

// Pause on hover
carousel.addEventListener('mouseenter', stopAutoPlay);
carousel.addEventListener('mouseleave', startAutoPlay);

// Recalculate on window resize (important for responsiveness)
window.addEventListener('resize', () => {
    calculateDimensions();
    updateTransform(); // Re-align current position
});