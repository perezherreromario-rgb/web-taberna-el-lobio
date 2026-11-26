/* Taberna El Lobio · lógica de la web
   - Interruptor de local (se recuerda)
   - "Abierto ahora" con la hora de Cantabria
   - Carta con buscador y categorías
   - Sello que gira con el scroll y "se estampa" al llamar
*/
document.documentElement.classList.add('js');

/* ---------- DATOS ---------- */
// Horarios según Google Maps (nov 2026). Formato: [abre, cierra] en minutos; cierre > 1440 = pasada la medianoche.
// Día 0 = domingo … 6 = sábado. Martes cerrado en ambos.
const H = (h, m = 0) => h * 60 + m;
const LOCALES = {
  tanos: {
    name: 'Tanos',
    tel: '+34942891157',
    route: 'https://www.google.com/maps/dir/?api=1&destination=43.3371256,-4.044961',
    hours: {
      0: [[H(9), H(24)]], 1: [[H(9), H(24)]], 2: [], 3: [[H(9), H(24)]],
      4: [[H(9), H(24)]], 5: [[H(9), H(25)]], 6: [[H(9), H(25)]],
    },
  },
  torrelavega: {
    name: 'Torrelavega',
    tel: '+34942014502',
    route: 'https://www.google.com/maps/dir/?api=1&destination=43.3469732,-4.0468317',
    hours: {
      0: [[H(9), H(17)], [H(20), H(24)]], 1: [[H(9), H(17)], [H(20), H(24)]], 2: [],
      3: [[H(9), H(17)], [H(20), H(24)]], 4: [[H(9), H(17)], [H(20), H(24)]],
      5: [[H(9), H(17)], [H(20), H(24)]], 6: [[H(9), H(17)], [H(20), H(24)]],
    },
  },
};

// Carta. Precios de referencia tomados de Glovo (26-11-2026): PENDIENTES DE CONFIRMAR EN SALA.
// top: lo más pedido · veg: vegetariano/vegano
const CARTA = [
  { id: 'bocadillos', t: 'Bocadillos', items: [
    ['Bocadillo Lobio', 9, 'Hamburguesa, lomo, jamón, queso, cebolla, tortilla, beicon, lechuga, tomate y mayonesa', 'top'],
    ['Bocadillo vegano', 9, 'Aguacate, pimientos rojos asados, rúcula y cebolla caramelizada', 'veg'],
    ['Bocadillo nº 3', 8, 'Lomo, queso, beicon y tortilla'],
    ['Bocadillo nº 12', 8, 'Lomo, queso y pimiento al horno'],
    ['Bocadillo vegetal', 8, 'Lechuga, tomate, bonito, espárragos, mayonesa y huevo'],
    ['Bocadillo nº 4', 7, 'Pollo, beicon, lechuga, tomate y mayonesa'],
    ['Bocadillo de beicon con queso', 6, ''],
    ['Perrito', 5, ''],
  ]},
  { id: 'hamburguesas', t: 'Hamburguesas', items: [
    ['Hamburguesa 39300', 12, 'Buey (200 g), quesos, beicon y cebolla frita, envuelta en hojaldre'],
    ['Hamburguesa Aeme', 12, 'Pan brioche, cheddar, pepinillo y salsa especial'],
    ['La Picantona', 12, 'Pan brioche, dos quesos, cebolla caramelizada y salsa picante'],
    ['Hamburguesa americana', 11, 'Buey (200 g), lechuga, tomate, mayonesa, cheddar y cebolla frita'],
    ['Hamburguesa Rebelde', 11, 'Dos hamburguesas, cheddar y beicon', 'top'],
    ['Hamburguesa Tanos', 10, 'Dos hamburguesas, beicon, rulo de cabra, cebolla caramelizada, lechuga, tomate y mayonesa'],
    ['Hamburguesa de guacamole', 10, 'Aguacate, guacamole, cebolla frita, lechuga, tomate y mayonesa'],
    ['Hamburguesa ibérica', 9, 'Paleta ibérica, huevo, queso, lechuga, tomate y mayonesa'],
    ['Hamburguesa Lobio', 8, 'Jamón york, queso, beicon, lomo, tortilla, lechuga, tomate y mayonesa', 'top'],
    ['Hamburguesa completa', 7, 'Jamón, queso, lechuga, tomate, cebolla y mayonesa'],
    ['Hamburguesa mixta', 5, 'Con jamón york y queso'],
    ['Hamburguesa sola', 5, 'Vacuno de 110 g'],
  ]},
  { id: 'sandwiches', t: 'Sándwiches', items: [
    ['Sándwich de berenjena gratinada', 10, 'Berenjena, jamón, queso, pollo, pimientos asados, cebolla roja y salsa de yogur, gratinado al horno'],
    ['Sándwich Tanos', 9, 'Jamón york y emmental gratinado al horno'],
    ['Sándwich de pollo con pimientos', 7.5, 'Jamón, queso, pollo y pimientos asados'],
    ['Sándwich Lobio', 7, 'Bonito, espárragos, jamón, queso, tortilla, beicon, lomo, lechuga, tomate y mayonesa'],
    ['Sándwich vegetal', 6, 'Lechuga, tomate, mayonesa, espárragos, bonito y huevo'],
    ['Mixto con tortilla', 4.5, 'Jamón york, queso y tortilla'],
  ]},
  { id: 'raciones', t: 'Raciones', items: [
    ['Rabas', 10, 'Con alioli'],
    ['Croquetas caseras de jamón', 9, '10 unidades'],
    ['Nachos', 8, 'Con queso gratinado'],
    ['Alitas de pollo', 8, ''],
    ['Fingers de pollo', 8, ''],
    ['Rulo de cabra con cebolla caramelizada', 7, ''],
    ['Patatas Lobio', 11, 'Beicon y cuatro quesos gratinados', 'top'],
    ['Patatas 3 salsas', 6, 'Kétchup, alioli y brava'],
  ]},
  { id: 'combinados', t: 'Platos combinados', items: [
    ['Entrecot', 15, 'Con patatas fritas y pimientos'],
    ['Plato nº 8', 10, 'Rabas, croquetas, patatas y huevo'],
    ['Combinado de torreznos', 10, 'Torreznos, croquetas, patatas y huevos'],
  ]},
  { id: 'postres', t: 'Postres', items: [
    ['Tarta de queso al horno', 5, 'Porción'],
    ['Tarta de la abuela', 4.5, 'Galleta, crema pastelera y chocolate'],
  ]},
  { id: 'bebidas', t: 'Bebidas', items: [
    ['Estrella Galicia 33 cl', 3, ''],
    ['1906 33 cl', 3, ''],
    ['Nestea / Nestea maracuyá', 3, ''],
    ['Agua 1 l', 3, ''],
    ['Coca-Cola, Zero, Zero Zero', 2.5, 'Lata'],
    ['Aquarius limón o naranja', 2.5, 'Lata'],
    ['Agua 33 cl', 1.5, ''],
  ]},
];

/* ---------- UTIL ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const eur = (n) => n.toLocaleString('es-ES', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
const hhmm = (m) => { m = m % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Hora actual en Cantabria, aunque el móvil esté en otra zona
function nowMadrid() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  return { day, min: (+p.hour) * 60 + (+p.minute) };
}

/* ---------- ABIERTO AHORA ---------- */
function statusOf(key) {
  const { day, min } = nowMadrid();
  const hours = LOCALES[key].hours;
  // ¿sigue abierto de ayer (pasada la medianoche)?
  const prev = (day + 6) % 7;
  for (const [a, c] of hours[prev]) if (c > 1440 && min < c - 1440) return { open: true, until: c };
  for (const [a, c] of hours[day]) if (min >= a && min < c) return { open: true, until: c };
  // próxima apertura
  for (const [a] of hours[day]) if (a > min) return { open: false, next: `hoy a las ${hhmm(a)}` };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (hours[d].length) return { open: false, next: `${i === 1 ? 'mañana' : DIAS[d].toLowerCase()} a las ${hhmm(hours[d][0][0])}` };
  }
  return { open: false, next: '' };
}
function paintStatus() {
  for (const key of Object.keys(LOCALES)) {
    const s = statusOf(key);
    for (const el of $$(`[data-status="${key}"]`)) {
      el.classList.toggle('is-open', s.open);
      el.classList.toggle('is-closed', !s.open);
      $('.status__t', el).textContent = s.open
        ? `Abierto · cierra a las ${s.until >= 1440 && s.until % 1440 === 0 ? '00:00' : hhmm(s.until)}`
        : `Cerrado · abre ${s.next}`;
    }
  }
}

function paintHours() {
  const { day } = nowMadrid();
  const order = [1, 2, 3, 4, 5, 6, 0];
  for (const key of Object.keys(LOCALES)) {
    const t = $(`[data-hours="${key}"]`);
    if (!t) continue;
    t.innerHTML = order.map((d) => {
      const r = LOCALES[key].hours[d];
      const txt = r.length ? r.map(([a, c]) => `${hhmm(a)}–${hhmm(c)}`).join(' · ') : 'Cerrado';
      return `<tr class="${d === day ? 'today' : ''}"><td>${DIAS[d]}</td><td>${txt}</td></tr>`;
    }).join('');
  }
}

/* ---------- INTERRUPTOR DE LOCAL ---------- */
function setLocal(key, save = true) {
  if (!LOCALES[key]) key = 'tanos';
  const L = LOCALES[key];
  const sw = $('.switch');
  sw.dataset.on = key;
  $$('button', sw).forEach((b) => b.setAttribute('aria-checked', String(b.dataset.local === key)));
  $$('[data-bind="name"]').forEach((el) => (el.textContent = L.name));
  $$('[data-bind-call]').forEach((el) => (el.href = 'tel:' + L.tel));
  $$('[data-bind-route]').forEach((el) => (el.href = L.route));
  $$('.barra').forEach((el) => el.classList.toggle('is-mine', el.dataset.card === key));
  if (save) try { localStorage.setItem('lobio-local', key); } catch (e) {}
}
$$('.switch button').forEach((b) => b.addEventListener('click', () => setLocal(b.dataset.local)));
$('.switch').addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const next = $('.switch').dataset.on === 'tanos' ? 'torrelavega' : 'tanos';
  setLocal(next); $(`.switch [data-local="${next}"]`).focus();
});

/* ---------- CARTA ---------- */
const menuEl = $('#menu'), chipsEl = $('#chips');
function renderMenu(q = '') {
  const nq = norm(q.trim());
  let total = 0;
  menuEl.innerHTML = CARTA.map((cat) => {
    const items = cat.items.filter(([n, , d]) => !nq || norm(n + ' ' + d).includes(nq));
    total += items.length;
    if (!items.length) return '';
    return `<section class="cat" id="cat-${cat.id}" aria-labelledby="h-${cat.id}">
      <div class="cat__h"><h3 id="h-${cat.id}">${cat.t}</h3><span>${items.length}</span></div>
      <ul class="items">${items.map(([n, p, d, tag], i) => `
        <li class="it" style="--i:${i}">
          <div class="it__row"><span class="it__n">${n}${tag === 'top' ? '<span class="tag">Lo más pedido</span>' : tag === 'veg' ? '<span class="tag tag--v">Vegano</span>' : ''}</span><span class="it__dots" aria-hidden="true"></span><span class="it__p">${eur(p)}</span></div>
          ${d ? `<p class="it__d">${d}</p>` : ''}
        </li>`).join('')}
      </ul></section>`;
  }).join('');
  $('#empty').hidden = total > 0;
  observeCats(!!nq);
}
chipsEl.innerHTML = CARTA.map((c) => `<a class="chip" href="#cat-${c.id}" data-cat="${c.id}">${c.t}</a>`).join('');
let qTimer;
$('#q').addEventListener('input', (e) => { clearTimeout(qTimer); qTimer = setTimeout(() => renderMenu(e.target.value), 120); });

let catObs, chipObs;
function observeCats(instant) {
  catObs?.disconnect(); chipObs?.disconnect();
  const cats = $$('.cat');
  if (instant || !('IntersectionObserver' in window) || /[?&]todo/.test(location.search)) { cats.forEach((c) => c.classList.add('printed')); }
  else {
    catObs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('printed'); catObs.unobserve(e.target); } }), { rootMargin: '0px 0px -15% 0px' });
    cats.forEach((c) => catObs.observe(c));
  }
  chipObs = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const id = e.target.id.replace('cat-', '');
    $$('.chip').forEach((ch) => ch.classList.toggle('is-on', ch.dataset.cat === id));
    const on = $(`.chip[data-cat="${id}"]`);
    if (on) chipsEl.scrollTo({ left: on.offsetLeft - 16, behavior: 'smooth' });
  }), { rootMargin: '-30% 0px -60% 0px' });
  cats.forEach((c) => chipObs.observe(c));
}

/* ---------- MAPAS (se cargan solo si se piden) ---------- */
$$('.loc__map').forEach((box) => {
  $('.map-load', box).addEventListener('click', () => {
    box.innerHTML = `<iframe title="Mapa" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${box.dataset.map}&z=16&output=embed"></iframe>`;
  });
});

/* ---------- MOVIMIENTO ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  const rings = $$('.seal__ring');
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { rings.forEach((r) => r.style.setProperty('--rot', (scrollY * 0.08) + 'deg')); ticking = false; });
  }, { passive: true });
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-stamp]');
  if (!a) return;
  a.classList.remove('is-stamped'); void a.offsetWidth; a.classList.add('is-stamped');
});

/* ---------- INICIO ---------- */
let saved = 'tanos';
try { saved = localStorage.getItem('lobio-local') || 'tanos'; } catch (e) {}
setLocal(saved, false);
renderMenu();
paintStatus(); paintHours();
setInterval(paintStatus, 60000);
$('#y').textContent = new Date().getFullYear();
