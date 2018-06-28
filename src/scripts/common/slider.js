const slides = document.querySelectorAll('#slides .slide');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const controls = document.querySelectorAll('.controls');

let currentSlide = 0;

function goToSlide(n) {
  slides[currentSlide].className = 'slide';
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].className = 'slide showing';
}

function setupListeners() {
  next.onclick = function () {
    goToSlide(currentSlide + 1);
  };
  prev.onclick = function () {
    goToSlide(currentSlide - 1);
  };
}

function showButtons() {
  for (let i = 0; i < controls.length; i++) {
    controls[i].style.display = 'inline-block';
  }
}

function sliderInit() {
  if (slides.length !== 0) {
    setupListeners();
    showButtons();
  }
}

module.exports = sliderInit;