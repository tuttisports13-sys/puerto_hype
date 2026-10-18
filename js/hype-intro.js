// Intro de Hypey (ver css/hype-intro.css)
(function () {
  var SOLO_UNA_VEZ = true;    // sale solo la 1ª vez por pestaña; en false sale siempre
  var DURACION = 3900;        // ms hasta que se levanta el telón

  var intro = document.getElementById('hype-intro');
  if (!intro) return;

  var yaVista = false;
  try { yaVista = SOLO_UNA_VEZ && sessionStorage.getItem('hypeIntro') === '1'; } catch (e) {}
  var reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (yaVista || reducirMovimiento) { intro.remove(); return; }

  document.documentElement.classList.add('intro-activa');
  var runner = intro.querySelector('.runner');

  // nubecitas de polvo detrás de Hypey
  var polvo = setInterval(function () {
    var r = runner.getBoundingClientRect();
    if (r.right < 0 || r.left > window.innerWidth) return;
    var p = document.createElement('span');
    p.className = 'hype-polvo';
    p.style.left = (r.left + r.width * 0.3) + 'px';
    p.style.top = (r.bottom - 22) + 'px';
    intro.appendChild(p);
    setTimeout(function () { p.remove(); }, 650);
  }, 110);

  var terminado = false;
  function terminar() {
    if (terminado) return;
    terminado = true;
    clearInterval(polvo);
    try { sessionStorage.setItem('hypeIntro', '1'); } catch (e) {}
    intro.classList.add('salir');
    document.documentElement.classList.remove('intro-activa');
    setTimeout(function () { intro.remove(); }, 800);
  }

  setTimeout(terminar, DURACION);
  intro.querySelector('.saltar').addEventListener('click', terminar);
})();
