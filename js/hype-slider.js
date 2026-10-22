// Panel principal que se desliza sin parar, como el ticker de arriba (ver css/hype-slider.css)
(function () {
  var SEGUNDOS_POR_SLIDE = 9; // más alto = más lento

  var slider = document.querySelector('.hero-slider');
  if (!slider) return;
  var track = slider.querySelector('.hero-track');

  // las promos se quitan solas a partir de su fecha (data-hasta="AAAA-MM-DD")
  Array.prototype.forEach.call(track.querySelectorAll('.hero-slide[data-hasta]'), function (s) {
    if (new Date() >= new Date(s.getAttribute('data-hasta') + 'T00:00:00')) s.remove();
  });
  var originales = Array.prototype.slice.call(track.querySelectorAll('.hero-slide'));
  if (originales.length < 2) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // copia de los slides para que el ciclo no tenga cortes
  originales.forEach(function (s) {
    var copia = s.cloneNode(true);
    copia.setAttribute('aria-hidden', 'true');
    copia.setAttribute('inert', '');
    copia.classList.add('hero-copia');
    track.appendChild(copia);
  });

  function medir() {
    slider.style.setProperty('--slide-w', slider.clientWidth + 'px');
  }
  medir();
  window.addEventListener('resize', medir);

  track.style.animationDuration = (SEGUNDOS_POR_SLIDE * originales.length) + 's';
  slider.classList.add('en-marcha');

  // en celular se pausa mientras lo tocan, para poder picar los botones
  var soltar = null;
  slider.addEventListener('touchstart', function () {
    clearTimeout(soltar);
    slider.classList.add('tocando');
  }, { passive: true });
  slider.addEventListener('touchend', function () {
    soltar = setTimeout(function () { slider.classList.remove('tocando'); }, 2500);
  });

  // los textos que vienen del panel admin también se pasan a las copias
  function copiarTextos() {
    originales.forEach(function (s, i) {
      var copia = track.querySelectorAll('.hero-copia')[i];
      if (copia && copia.innerHTML !== s.innerHTML) copia.innerHTML = s.innerHTML;
    });
  }
  new MutationObserver(copiarTextos).observe(originales[0], { childList: true, subtree: true, characterData: true });
})();
