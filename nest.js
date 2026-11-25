/* hariprav.in · look proof · the owl and its nest.
   A layer over the owl's trail (blend.js keeps the questions, the feathers and the saved progress):
   - the owl WEARS every feather it wins back, so progress is seen on the character itself;
   - trying things on an island finds a gift for its nest, one per island;
   - everything the visitor does makes the owl like them more, on one ladder from Stranger to Best friend;
   - the nest replaces the side drawer. It opens from the Nest button in the top bar, never only from the owl. */
(() => {
'use strict';
const TG = window.TG; if (!TG) return;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const LADDER = [
  [0, 'Stranger', 'We have only just met.', ''],
  [25, 'Visitor', 'You have started looking around.', 'Welcome, visitor. Look around!'],
  [300, 'Friend', 'You know a few of my islands.', 'I think we are friends now.'],
  [700, 'Good friend', 'You know most of what Hari does.', 'You are a good friend. Not many come this far.'],
  [1000, 'Best friend', 'You have seen it all.', 'Best friend! Nobody knows these islands better.'],
];
const level = () => { const s = TG.score(); let k = 0; LADDER.forEach((l, i) => { if (s >= l[0]) k = i; }); return k; };
window.NESTRANK = () => LADDER[level()][1];

/* one gift on every island, found by trying what that island offers */
const GIFTS = [
  ['plate', 'w1', 'A breakfast plate', 'Play the trailer or any plate'], ['paavam', 'w2', 'A sprout', 'Ask Paavam something'],
  ['song', 'w3', 'A music note', 'Play a song'], ['book', 'w4', 'A little book', 'Flip the book over'],
  ['work', 'w5', 'A spark', 'Visit the featured work'], ['lab', 'w6', 'A flask', 'Open an explainer'],
  ['scroll', 'w7', 'A page', 'Open an essay'], ['hello', 'p2', 'A postcard', 'Open any contact or social link'],
];
window.NESTGIFTS = Object.fromEntries(GIFTS.map(g => [g[0], g[2]]));
const HEART = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.500C4.500 15 3 10.500 5.200 7.300 7 4.700 10.600 5 12 7.600 13.400 5 17 4.700 18.800 7.300 21 10.500 19.500 15 12 20.500z"/></svg>';
const sectionName = id => { const t = TG.TRAIL.find(x => x.id === id); return t ? t.name : ''; };

const ns = $('#nscrim');
const open = o => { ns.classList.toggle('open', o); if (o) paint(); };
const go = sel => { open(false); const el = $(sel); if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: sel.startsWith('.owlq') ? 'center' : 'start' }); };

function paint() {
  const S = TG.S(), got = TG.TRAIL.map(t => !!S.got[t.id]), n = got.filter(Boolean).length, lv = level(), score = TG.score();
  const list = window.HP && window.HP.list ? window.HP.list() : [];
  /* on the owl itself, in the world */
  if (window.OWL && window.OWL.wear) { window.OWL.wear(got); window.OWL.gold(n === 8); }
  const rk = $('#nrank'); if (rk) rk.textContent = LADDER[lv][1];
  if (!ns.classList.contains('open')) return;
  /* the owl in its nest, wearing what it has won back */
  $('#nfan').innerHTML = TG.TRAIL.map((t, k) => `<button type="button" class="nf ${got[k] ? 'got' : ''}" style="--a:${((k - 3.5) * 21).toFixed(1)}deg" data-f="${t.id}" title="${got[k] ? t.f : 'Still on ' + t.name}" aria-label="${got[k] ? t.f + ', won' : t.f + ', still on ' + t.name}">${TG.FEATHERS[t.id]}</button>`).join('');
  $('#nowl').classList.toggle('gold', n === 8);
  $('#nsay').textContent = n === 8 ? `All eight are back. Thank you, ${LADDER[lv][1].toLowerCase()}.` : n === 0 ? 'I have lost my eight feathers, one on each island. Tap an empty one and I will take you to it.' : `${n} of my 8 feathers are back. Tap an empty one and I will take you to it.`;
  /* you and the owl */
  const next = LADDER[lv + 1];
  $('#nladder').innerHTML = LADDER.map((l, i) => `<li class="${i < lv ? 'done' : i === lv ? 'now' : ''}"><span class="nh">${HEART}</span><span><b>${l[1]}</b><small>${l[2]}</small>${i === lv && next ? `<i class="nbar"><i style="width:${Math.round((score - l[0]) / (next[0] - l[0]) * 100)}%"></i></i>` : ''}</span></li>`).join('');
  /* gifts and surprises */
  const gifts = GIFTS.map(g => Object.assign({}, list.find(q => q.id === g[0]) || {}, { id: g[0], at: g[1], name: g[2], how: g[3] }));
  $('#ngc').textContent = gifts.filter(g => g.done).length;
  $('#ngifts').innerHTML = gifts.map(g => `<button type="button" class="bdg ${g.done ? 'got' : ''}" style="--bc:${g.c || '#D63A2F'}" data-at="${g.at}"><span class="star">${g.done ? g.icon : (window.HP ? window.HP.icons.lock : '')}</span><small>${g.name}</small><em>${g.done ? 'In the nest' : g.how}</em></button>`).join('');
  const sur = TG.EXTRA.map(s => Object.assign({}, s, { done: !!S.st[s.id] }));
  $('#nsc').textContent = sur.filter(s => s.done).length; $('#nst').textContent = sur.length;
  $('#nsur').innerHTML = sur.map(s => `<div class="bdg ${s.done ? 'got' : 'secret'}" style="--bc:${s.c}"><span class="star">${s.done ? s.icon : '<b>?</b>'}</span><small>${s.done ? s.name : 'A surprise'}</small></div>`).join('');
  $('#nGold').hidden = n !== 8;
}

/* opening and closing: the Nest button, Esc, the close button, a click outside */
document.addEventListener('hp:nest', () => open(!ns.classList.contains('open')));
$$('[data-nclose]').forEach(b => b.addEventListener('click', () => open(false)));
ns.addEventListener('click', e => { if (e.target === ns) open(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') open(false); });
$('#nfan').addEventListener('click', e => { const b = e.target.closest('.nf'); if (b) go(`.owlq[data-f="${b.dataset.f}"]`); });
$('#ngifts').addEventListener('click', e => { const b = e.target.closest('[data-at]'); if (b) go('#' + b.dataset.at); });
$('#nGold').addEventListener('click', () => { open(false); TG.openGold(); });
{ const rb = $('#nReset'); let sure = 0;
  rb.addEventListener('click', () => { if (!sure) { sure = setTimeout(() => { sure = 0; rb.textContent = 'Start over'; rb.classList.remove('sure'); }, 5000); rb.textContent = 'Tap again to clear everything'; rb.classList.add('sure'); return; } clearTimeout(sure); TG.reset(); }); }

/* the owl says so when you move up the ladder */
let was = level();
document.addEventListener('hp:trail', () => { paint(); const lv = level(); if (lv > was) { const l = LADDER[lv]; document.dispatchEvent(new CustomEvent('hp:friend', { detail: { level: lv } })); setTimeout(() => { if (window.OWL) { window.OWL.say(l[3], 5200); window.OWL.cheer(); } if (window.HP && window.HP.toast) window.HP.toast('You and the owl', l[1], HEART, '#D63A2F'); }, 2400); } was = lv; });
paint();
})();
