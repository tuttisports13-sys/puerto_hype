// Slider del panel principal (ver css/hype-slider.css)
(function () {
  var INTERVALO = 6000; // ms que se queda cada slide

  var slider = document.querySelector('.hero-slider');
  if (!slider) return;
  var track = slider.querySelector('.hero-track');
  var slides = slider.querySelectorAll('.hero-slide');
  var dotsBox = slider.querySelector('.hero-dots');
  if (slides.length < 2) return;

  var actual = 0;
  var timer = null;

  var dots = Array.prototype.map.call(slides, function (s, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Ir al slide ' + (i + 1));
    b.addEventListener('click', function () { ir(i); reiniciar(); });
    dotsBox.appendChild(b);
    return b;
  });

  function ir(i) {
    actual = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-100 * actual) + '%)';
    dots.forEach(function (d, j) { d.classList.toggle('activo', j === actual); });
    slider.classList.toggle('en-negro', slides[actual].classList.contains('slide-nojersey'));
    Array.prototype.forEach.call(slides, function (s, j) {
      if (j === actual) s.removeAttribute('inert'); else s.setAttribute('inert', '');
    });
  }

  function reiniciar() {
    clearInterval(timer);
    timer = setInterval(function () { ir(actual + 1); }, INTERVALO);
  }

  // pausa cuando el mouse está encima
  slider.addEventListener('mouseenter', function () { clearInterval(timer); });
  slider.addEventListener('mouseleave', reiniciar);

  // deslizar con el dedo en celular
  var x0 = null;
  slider.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { ir(actual + (dx < 0 ? 1 : -1)); reiniciar(); }
    x0 = null;
  });

  ir(0);
  reiniciar();
})();
