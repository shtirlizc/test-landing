const carousel = document.querySelector(".carousel");
const wrapper = carousel.querySelector(".carousel__wrapper");
const items = [...carousel.querySelectorAll(".carousel__item")];
const [prevBtn, nextBtn] = document.querySelectorAll(
  ".participants__pagination .btn-slider",
);
const counter = document.querySelector(".participants__pagination-body");

const BREAKPOINT = 991;
const AUTOPLAY_DELAY = 4000;
let current = 0;
let autoplay = null;

function goTo(index, smooth = true) {
  const visibleCount = getVisibleCount();

  const maxIndex = items.length - visibleCount;

  if (index > maxIndex) {
    index = 0;
  }

  if (index < 0) {
    index = maxIndex;
  }

  current = index;

  const target = items[index];

  wrapper.scrollTo({
    left: target.offsetLeft,
    behavior: smooth ? "smooth" : "auto",
  });

  updateCounter();
}

function updateCounter() {
  counter.innerHTML = `
    ${current + 1}
    <span>/ ${items.length}</span>
  `;
}

prevBtn.addEventListener("click", () => {
  stopAutoplay();

  goTo(current - 1);

  startAutoplay();
});

nextBtn.addEventListener("click", () => {
  stopAutoplay();

  goTo(current + 1);

  startAutoplay();
});

function updateCurrentFromScroll() {
  let closest = 0;

  let minDistance = Infinity;

  items.forEach((item, index) => {
    const distance = Math.abs(wrapper.scrollLeft - item.offsetLeft);

    if (distance < minDistance) {
      minDistance = distance;
      closest = index;
    }
  });

  const visibleCount = getVisibleCount();
  const maxIndex = items.length - visibleCount;

  current = Math.min(closest, maxIndex);

  updateCounter();
}

let scrollRAF = null;

wrapper.addEventListener("scroll", () => {
  if (scrollRAF) return;

  scrollRAF = requestAnimationFrame(() => {
    updateCurrentFromScroll();

    scrollRAF = null;
  });
});

function startAutoplay() {
  stopAutoplay();

  autoplay = setInterval(() => {
    goTo(current + 1);
  }, AUTOPLAY_DELAY);
}

function stopAutoplay() {
  clearInterval(autoplay);
}

wrapper.addEventListener("pointerdown", stopAutoplay);
wrapper.addEventListener("pointerup", startAutoplay);
wrapper.addEventListener("touchstart", stopAutoplay);
wrapper.addEventListener("touchend", startAutoplay);
carousel.addEventListener("mouseenter", stopAutoplay);
carousel.addEventListener("mouseleave", startAutoplay);

function getVisibleCount() {
  return window.innerWidth >= BREAKPOINT ? 3 : 1;
}

updateCounter();

const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  },
  {
    threshold: 0.5,
  },
);

observer.observe(carousel);

window.addEventListener("resize", () => {
  const visibleCount = getVisibleCount();

  const maxIndex = items.length - visibleCount;

  current = Math.min(current, maxIndex);

  goTo(current, false);

  updateCounter();
});
