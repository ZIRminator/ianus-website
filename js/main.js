/* ianus IT – kleines Skript für Menü, E-Mail-Links, Formular und Bewegung.
   Die Seiten funktionieren auch ohne; dann ist einfach alles sofort sichtbar. */
(function () {
  // Menü auf dem Handy öffnen und schließen
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('hauptnavigation');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
  }

  // E-Mail-Adressen erst im Browser zusammensetzen (Schutz vor Spam-Programmen)
  document.querySelectorAll('.js-mail').forEach(function (link) {
    var address = link.getAttribute('data-user') + '@' + link.getAttribute('data-domain');
    link.setAttribute('href', 'mailto:' + address);
    if (link.textContent.indexOf('[at]') !== -1) link.textContent = address;
  });

  // Kontaktformular: Zeitmarke für den Bot-Schutz setzen
  var token = document.querySelector('.contact-form input[name="form_token"]');
  if (token) token.value = 'ianus-' + Date.now();

  // Kopfzeile: leichter Schatten, sobald gescrollt wurde
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Bewegung beim Scrollen: schräge Kanten, Bilder, Linien.
  // Nur wenn der Browser es kann und niemand "weniger Bewegung" eingestellt hat.
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll('.slant, .service, .page-hero, .related__item, .tech-grid, .contact-ways');
  if (!targets.length) return;
  document.documentElement.classList.add('motion');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  targets.forEach(function (el) { observer.observe(el); });

  // Beim Drucken alles sofort zeigen
  window.addEventListener('beforeprint', function () {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  });
})();
