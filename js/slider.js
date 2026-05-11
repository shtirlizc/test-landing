const BREAKPOINT = 991;

const slider = document.querySelector("#slider");
const content = slider.querySelector(".slider__content");

const originalHTML = content.innerHTML;

let mobileMode = false;

function buildMobileSlides() {
  content.innerHTML = originalHTML;

  const slides = [...content.children];

  const processed = new Set();

  slides.forEach((slide, index) => {
    if (processed.has(slide)) return;

    const span = Number(slide.dataset.span);

    if (!Number.isFinite(span)) return;

    const count = span + 1;

    const group = slides.slice(index, index + count);

    const wrapper = document.createElement("div");
    wrapper.className = "slide__common";

    slide.before(wrapper);

    group.forEach((item) => {
      processed.add(item);

      item.classList.remove("slide__common");

      wrapper.append(item);
    });
  });
}

function buildDesktopSlides() {
  content.innerHTML = originalHTML;
}

function checkSliderMode() {
  const isMobile = window.innerWidth < BREAKPOINT;

  if (isMobile && !mobileMode) {
    buildMobileSlides();
    mobileMode = true;
  }

  if (!isMobile && mobileMode) {
    buildDesktopSlides();
    mobileMode = false;
  }
}

checkSliderMode();

window.addEventListener("resize", checkSliderMode);

const wrapper = slider.querySelector(".slider__wrapper");

function getSlides() {
  return [...slider.querySelectorAll(".slide__common")];
}

let currentSlide = 0;

function goToSlide(index) {
  if (window.innerWidth >= BREAKPOINT) return;

  const slides = getSlides();

  const safeIndex = Math.max(0, Math.min(index, slides.length - 1));

  slides[safeIndex]?.scrollIntoView({
    behavior: "smooth",
    inline: "start",
    block: "nearest",
  });

  currentSlide = safeIndex;

  updatePagination();
  updateButtons();
}

const [prevBtn, nextBtn] = slider.querySelectorAll(".btn-slider");

prevBtn.addEventListener("click", () => {
  goToSlide(currentSlide - 1);
});

nextBtn.addEventListener("click", () => {
  goToSlide(currentSlide + 1);
});

const paginationBtns = [...slider.querySelectorAll(".slider__pagination-btn")];

function updatePagination() {
  paginationBtns.forEach((btn, index) => {
    btn.classList.toggle("active", index === currentSlide);
  });
}

function updateButtons() {
  const slides = getSlides();

  prevBtn.disabled = currentSlide === 0;

  nextBtn.disabled = currentSlide === slides.length - 1;
}

function updateCurrentSlide() {
  if (window.innerWidth >= BREAKPOINT) return;

  const slides = getSlides();

  const wrapperLeft = wrapper.scrollLeft;

  let closestIndex = 0;
  let closestDistance = Infinity;

  slides.forEach((slide, index) => {
    const distance = Math.abs(slide.offsetLeft - wrapperLeft);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  if (closestIndex !== currentSlide) {
    currentSlide = closestIndex;

    updatePagination();
    updateButtons();
  }
}

let scrollRAF = null;

wrapper.addEventListener("scroll", () => {
  if (window.innerWidth >= BREAKPOINT) return;

  if (scrollRAF) return;

  scrollRAF = requestAnimationFrame(() => {
    updateCurrentSlide();

    scrollRAF = null;
  });
});

paginationBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    goToSlide(index);
  });
});

updatePagination();
updateButtons();
