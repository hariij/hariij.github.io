/* hariprav.in · the blend · the owl's trail.
   A small game with a goal, a challenge, feedback and a payoff:
   the owl has hidden eight feathers, one on each island, and no two are alike. A feather is won by answering the owl's
   question about what that section shows. Trying things (playing a plate, flipping the book, tapping the owl) earns
   stickers for the album: sixteen in all, two of them secret.
   Eight feathers unlock the golden feather: an explorer's card to keep, and a word from Hari. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NEST = document.body.classList.contains('nest');                  // the owl-and-nest proof lays its own view over this trail

/* ---------- eight feathers, each its own shape and colour ---------- */
const INK = '#1A1512';
const fsvg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">${inner}</svg>`;
const FEATHERS = {
  /* broad and golden, with two banana-leaf bars */
  w1: fsvg('<path d="M20.5 3.5C12 3.5 6.2 8.3 5 16l-2.2 4.7L7.5 19C15.4 17.8 20.5 11.8 20.5 3.5z" fill="#F4B41A"/><path d="M5.5 18.5L15 9"/><path d="M9 15h4.5M11.5 12.5h4" stroke="#2E7D43" stroke-width="2.1"/>'),
  /* a soft mint puff of down */
  w2: fsvg('<path d="M9.5 14.5L3 21" stroke-width="1.9"/><path d="M13 3a3 3 0 0 1 4.6 1.6a3 3 0 0 1 2.6 4.2a3 3 0 0 1-.6 5a3 3 0 0 1-3.6 3.4a3 3 0 0 1-4.9.6a3 3 0 0 1-4.2-2.6a3 3 0 0 1-1.2-4.8a3 3 0 0 1 2.4-4.4A3 3 0 0 1 13 3z" fill="#7FDBA6"/><path d="M13 8.5a2.4 2.4 0 1 0 2.4 2.4"/>'),
  /* magenta, its edge cut in steps like a rising tune */
  w3: fsvg('<path d="M20.5 3.5C13 4 7 8 5.2 15.5l-2.2 5.3 5.2-2 .3-2.6 2.6.2.2-2.7 2.7.1.2-2.8 2.8 0C19.6 9 20.4 6.3 20.5 3.5z" fill="#C2398B"/><path d="M4 19.8L15.5 8.5" stroke="#FFE3F3" stroke-width="1.2"/>'),
  /* a writer's quill, indigo, with an inked nib */
  w4: fsvg('<path d="M21 3c-5.5.4-10.5 4-12.6 10.2L7 16.5l2.6-.6C15.6 13.6 20 9 21 3z" fill="#4A5FC1"/><path d="M7.8 14.6L3 21l6-4.6z" fill="#1A1512"/><path d="M9 15L18.5 5.5" stroke="#DCE3FF" stroke-width="1.1"/>'),
  /* cut from steel, all facets */
  w5: fsvg('<path d="M20.5 3.5L11 5.5 6 11.5 5 16l-2 5 4.8-1.8 4.7-1L18 12.5z" fill="#9DB2C6"/><path d="M3.5 20.5L20.5 3.5M11 5.5l1.5 6.5M6 11.5l6.5.5M12.5 12l5.500.500" stroke-width="1.1"/>'),
  /* a green eye on a stem, always looking */
  w6: fsvg('<path d="M3 21l8.5-8.5" stroke-width="2"/><circle cx="15.5" cy="8.5" r="6" fill="#43A35B"/><circle cx="15.5" cy="8.5" r="3.5" fill="#F4B41A" stroke-width="1.3"/><circle cx="15.5" cy="8.5" r="1.4" fill="#4A5FC1" stroke-width="1.1"/>'),
  /* paper pale, barred with ink like a page of lines */
  w7: fsvg('<path d="M19.5 4.5c1.5 5-1 10.5-6.5 13L7.5 19 3 21l2-4.5 1.5-5.5c2.5-5.5 8-8 13-6.5z" fill="#FFF6E3"/><path d="M8.5 15.3l4.7 1.2M10.5 11.8l6 1.7M13.5 8.3l5.2 1.5" stroke-width="1.7"/>'),
  /* a red heart at the tip */
  p2: fsvg('<path d="M12.5 13.5L3 21" stroke-width="2"/><path d="M15 15C8.5 11 9 5 12.3 5c1.4 0 2.3.9 2.7 2 .4-1.1 1.300-2 2.700-2C21 5 21.500 11 15 15z" fill="#D63A2F"/>'),
};
const GOLD = fsvg('<path d="M20.5 3.5C12 3.5 6.2 8.3 5 16l-2.2 4.7L7.5 19C15.4 17.8 20.5 11.8 20.5 3.5z" fill="#FFD75E"/><path d="M5.5 18.5L15 9M9 15h4.5M11.5 12.5h4"/>');

const TRAIL = [
  { id: 'w1', name: 'Series', f: 'the Tiffin feather', q: 'How many plates does #TiffinPsychology serve in all?', opts: ['8', '16', '24'], a: 1, hint: 'Count the tiles in the grid above, the empty ones too.' },
  { id: 'w2', name: 'பாவம் AI', f: 'the Paavam puff', q: 'What does Paavam say about every question, just before it fails?', opts: ['"Too easy!"', '"Too hard!"', '"Ask someone else."'], a: 0, hint: 'Ask it something in the chat. Its first reply is your answer.' },
  { id: 'w3', name: 'Songs', f: 'the Song feather', q: 'When Hari makes a song, what comes first?', opts: ['The tune', 'The video', 'The words'], a: 2, hint: 'The first line of this section says it.' },
  { id: 'w4', name: 'Books', f: 'the Story feather', q: 'Who tells the story in AI எனும் நான்?', opts: ['Hari', 'AI itself', 'A talking robot dog'], a: 1, hint: 'The line under the book\'s title says whose voice tells it.' },
  { id: 'w5', name: 'Work', f: 'the Steel feather', q: 'Since which year has Hari been building software?', opts: ['1995', '2000', '2010'], a: 1, hint: 'The first line of this section gives the year.' },
  { id: 'w6', name: 'Experiments', f: 'the Curious eye', q: 'In the Magic Reactor explainer, where is the reactor?', opts: ['Kalpakkam', 'Kudankulam', 'Tarapur'], a: 0, hint: 'The first card in this section names the place.' },
  { id: 'w7', name: 'Writing', f: 'the Ink feather', q: 'What does Hari mostly write about on Medium?', opts: ['Cricket', 'Cooking', 'AI and philosophy'], a: 2, hint: 'Read the line under this section\'s heading.' },
  { id: 'p2', name: 'Say hello', f: 'the Hello feather', q: 'Which city does Hari work from?', opts: ['Chennai', 'Coimbatore', 'Bengaluru'], a: 0, hint: 'Look at the very last line of the page.' },
];
const RANKS = [[0, 'Beginner'], [2, 'Finder'], [4, 'Collector'], [6, 'Expert'], [8, 'Champion']];   // none of these is also a sticker's name
if (window.SECTIONS) TRAIL.forEach(t => { const s = window.SECTIONS.find(x => x.id === t.id); if (s) t.name = s.name; });
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- stickers: nine for trying things, seven more from the trail itself ---------- */
const ic = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const HOW = { start: 'Start scrolling', plate: 'Play the trailer or any plate', paavam: 'Ask Paavam something, or play an episode', song: 'Play a song', book: 'Flip the book over', work: 'Visit the featured work', lab: 'Open an explainer', scroll: 'Open an essay', hello: 'Open any contact or social link' };
const NAME = { plate: 'Tiffin taster', paavam: 'Paavam\'s friend', song: 'Music lover', book: 'Book lover', work: 'Saw the work', lab: 'Curious mind', scroll: 'Reader', hello: 'Said hello' };                                    // plain names where the old game's badge name would mislead
const EXTRA = [
  { id: 'owl', name: 'Owl\'s friend', how: 'Tap the owl', c: '#4A5FC1', icon: ic('<circle cx="8" cy="11" r="3.5"/><circle cx="16" cy="11" r="3.5"/><path d="M10.5 16l1.5 2.5 1.5-2.5M4 5.5l3 2M20 5.5l-3 2"/>') },
  { id: 'sharp', name: 'Sharp eye', how: '3 feathers on the first try', c: '#C2398B', icon: ic('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6" fill="currentColor"/>') },
  { id: 'perfect', name: 'Perfect score', how: 'All 8 on the first try', c: '#F4B41A', icon: ic('<path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.200 9.400l6.100-.800z" fill="currentColor"/>') },
  { id: 'tea', name: 'Tea friend', how: 'Pick a tea at the tea counter', c: '#8A5A2B', icon: ic('<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3v2.5M12 3v2.5"/>') },
  { id: 'keeper', name: 'Card saved', how: 'Save your golden card', c: '#D63A2F', icon: ic('<path d="M12 3.5v11M7.5 10.5l4.5 4.5 4.5-4.5M4.500 19.500h15"/>') },
  { id: 'nest', name: 'Back to the nest', how: 'Reached the end, then came back to the top', secret: true, c: '#43A35B', icon: ic('<path d="M3.5 13.5a8.5 6 0 0 0 17 0z"/><circle cx="9.5" cy="10.5" r="2"/><circle cx="14.5" cy="10.5" r="2"/>') },
  { id: 'night', name: 'Night owl', how: 'Visited after ten at night', secret: true, c: '#1E1B3A', icon: ic('<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" fill="currentColor"/>') },
];
const TOTAL_ST = Object.keys(HOW).length + EXTRA.length;

const KEY = 'hp-trail-v1';
let S = { got: {}, first: {}, tried: {}, st: {}, gold: false };
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const feathers = () => TRAIL.filter(t => S.got[t.id]).length;
const firsts = () => TRAIL.filter(t => S.first[t.id]).length;
const stickers = () => (window.HP ? window.HP.count() : 0) + EXTRA.filter(s => S.st[s.id]).length;
const score = () => feathers() * 100 + firsts() * 50 + stickers() * 25;
const rank = () => { let r = RANKS[0][1]; RANKS.forEach(([n, name]) => { if (feathers() >= n) r = name; }); return r; };
const owl = (text, ms, act) => { if (window.OWL) window.OWL.say(text, ms, act); };
const toQuestion = id => { const q = $(`.owlq[data-f="${id}"]`); if (q) q.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); };
const MAXSCORE = 8 * 150 + TOTAL_ST * 25;
const nextRank = () => { const n = feathers(), nx = RANKS.find(([k]) => k > n); return nx ? `${nx[0] - n} more feather${nx[0] - n === 1 ? '' : 's'} to become ${nx[1]}` : 'Top rank reached'; };
function pts(n) { if (NEST) return; const pill = $('#bpill').getBoundingClientRect(), f = document.createElement('span'); f.className = 'ptsfly'; f.textContent = '+' + n; document.body.appendChild(f);
  f.style.left = (pill.left + pill.width / 2) + 'px'; f.style.top = (pill.bottom + 6) + 'px';
  if (reduce) { setTimeout(() => f.remove(), 1400); return; }
  f.animate([{ transform: 'translate(-50%,14px) scale(.6)', opacity: 0 }, { transform: 'translate(-50%,0) scale(1.15)', opacity: 1, offset: .25 }, { transform: 'translate(-50%,-4px) scale(1)', opacity: 1, offset: .75 }, { transform: 'translate(-50%,-26px) scale(.9)', opacity: 0 }], { duration: 1500, easing: 'ease-out' }).onfinish = () => f.remove(); }
const bump = () => { const pill = $('#bpill'); pill.classList.remove('pop'); void pill.offsetWidth; pill.classList.add('pop'); };

/* ---------- sound: on unless the visitor turns it off ---------- */
const tone = (...a) => { if (window.HP && window.HP.tone) window.HP.tone(...a); };
const SFX = { win: () => { if (window.HP && window.HP.sfx) window.HP.sfx.ok(); }, gold: () => { if (window.HP && window.HP.sfx) window.HP.sfx.up(); },
  wrong: () => { tone(196, 0, .16, 'sawtooth', .05); tone(147, .13, .24, 'sawtooth', .05); }, hint: () => tone(880, 0, .09, 'triangle', .07),
  hoot: () => { tone(392, 0, .2, 'sine', .12); tone(311, .24, .34, 'sine', .12); } };
const sndb = $('#sndb');
function setSound(on, quiet) { S.snd = !!on; save(); if (window.HP && window.HP.sound) window.HP.sound(on); if (sndb) { sndb.setAttribute('aria-pressed', on ? 'true' : 'false'); sndb.title = on ? 'Sound is on' : 'Sound is off'; } if (on && !quiet) SFX.hoot(); }
setSound(S.snd !== false, true);
if (sndb) sndb.addEventListener('click', () => setSound(!S.snd));

function award(id) {
  const s = EXTRA.find(x => x.id === id); if (!s || S.st[id]) return;
  S.st[id] = 1; save(); paint();
  if (window.HP && window.HP.toast) window.HP.toast(NEST ? 'A surprise for the owl' : (s.secret ? 'Secret sticker' : 'Sticker earned') + ' · +25', s.name, s.icon, s.c);
  bump(); pts(25); SFX.win();
}

/* ---------- the question at the foot of every section ---------- */
TRAIL.forEach((t, k) => {
  const host = $('#' + t.id + ' > .wrap'); if (!host) return;
  const el = document.createElement('div'); el.className = 'owlq'; el.dataset.f = t.id;
  el.innerHTML = `<span class="owlq-f">${FEATHERS[t.id]}</span><div class="owlq-b"><span class="pixel">Feather ${k + 1} of 8 · ${t.f}</span><h4>${t.q}</h4><div class="opts">${t.opts.map((o, i) => `<button type="button" data-i="${i}">${o}</button>`).join('')}</div><button type="button" class="askowl" data-hint>Ask the owl for a hint <small>gives up the +50 bonus</small></button><p class="owlq-msg" aria-live="polite"></p></div>`;
  host.appendChild(el);
  el.addEventListener('click', e => {
    if (e.target.closest('[data-hint]')) { if (S.got[t.id]) return; S.tried[t.id] = 1; save(); el.classList.add('hinted'); $('.owlq-msg', el).textContent = t.hint; owl(t.hint, 6500); if (window.OWL) window.OWL.cheer(); SFX.hint(); return; }
    const b = e.target.closest('button[data-i]'); if (!b || S.got[t.id]) return;
    if (+b.dataset.i === t.a) { S.got[t.id] = 1; if (!S.tried[t.id]) S.first[t.id] = 1; save(); collect(el, t); }
    else { S.tried[t.id] = 1; save(); b.classList.add('no'); b.disabled = true; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); $('.owlq-msg', el).textContent = 'Not that one. ' + t.hint; owl(t.hint, 5200); if (window.OWL && window.OWL.no) window.OWL.no(); SFX.wrong(); }
  });
});

function paint() {
  const n = feathers();
  TRAIL.forEach((t, k) => {
    const el = $(`.owlq[data-f="${t.id}"]`), got = !!S.got[t.id];
    if (el) { el.classList.toggle('won', got); if (got) { $$('button', el).forEach((b, i) => { b.disabled = true; b.classList.toggle('yes', i === t.a); }); $('.pixel', el).textContent = `Feather ${k + 1} of 8 · ${t.f} · yours`; $('.owlq-msg', el).textContent = S.first[t.id] ? 'Right the first time. A bonus for that.' : 'That is the one.'; } }
    const dot = $$('#prog i')[k]; if (dot) { dot.classList.toggle('got', got); if (!dot.innerHTML) dot.innerHTML = FEATHERS[t.id]; dot.title = got ? cap(t.f) : t.name; }
  });
  $$('.fslots').forEach(box => { box.innerHTML = TRAIL.map(t => `<i class="${S.got[t.id] ? 'got' : ''}" title="${S.got[t.id] ? cap(t.f) : t.name}">${FEATHERS[t.id]}</i>`).join(''); });
  $$('[data-trail="count"]').forEach(e => { e.textContent = n; });
  $$('[data-trail="score"]').forEach(e => { e.textContent = score(); });
  $$('[data-trail="rank"]').forEach(e => { e.textContent = rank(); });
  $$('[data-trail="stickers"]').forEach(e => { e.textContent = stickers(); });
  $$('[data-trail="stotal"]').forEach(e => { e.textContent = TOTAL_ST; });
  $$('[data-trail="max"]').forEach(e => { e.textContent = MAXSCORE; });
  $$('[data-trail="next"]').forEach(e => { e.textContent = nextRank(); });
  const list = $('#trailList'); if (list) list.innerHTML = TRAIL.map(t => `<li class="${S.got[t.id] ? 'got' : ''}"><a href="#${t.id}"><span class="tf">${FEATHERS[t.id]}</span><span><b>${cap(t.f)}</b><small>${S.got[t.id] ? (S.first[t.id] ? 'Yours, on the first try' : 'Yours') : 'Waiting in ' + t.name}</small></span><span class="pixel">${S.got[t.id] ? (S.first[t.id] ? '+150' : '+100') : ''}</span></a></li>`).join('');
  const album = $('#album'); if (album && window.HP && window.HP.list) {
    const all = [...window.HP.list().map(q => ({ name: NAME[q.id] || q.name, c: q.c, icon: q.icon, done: q.done, how: HOW[q.id] || '' })), ...EXTRA.map(s => Object.assign({}, s, { done: !!S.st[s.id] }))];
    album.innerHTML = all.map(s => `<div class="bdg ${s.done ? 'got' : ''}${s.secret && !s.done ? ' secret' : ''}" style="--bc:${s.c}"><div class="star">${s.done ? s.icon : s.secret ? '<b>?</b>' : window.HP.icons.lock}</div><small>${s.secret && !s.done ? 'Secret' : s.name}</small><em>${s.done ? (s.secret ? s.how : 'Earned') : s.secret ? 'Find it yourself' : s.how}</em></div>`).join('');
  }
  const hook = $('#hookBtn'); if (hook) hook.textContent = n === 0 ? 'Start the trail' : n === 8 ? 'See your golden feather' : 'Carry on the trail';
  document.body.classList.toggle('golden', n === 8);
  document.dispatchEvent(new CustomEvent('hp:trail'));
}

/* ---------- a feather is collected: it flies to the tracker ---------- */
function collect(el, t) {
  paint();
  const k = TRAIL.indexOf(t), from = $('.owlq-f', el).getBoundingClientRect(), d0 = $$('#prog i')[k], dot = d0 && d0.getClientRects().length ? d0 : null, to = (dot || $('#bpill')).getBoundingClientRect();
  if (!reduce) {
    const f = document.createElement('span'); f.className = 'flyf'; f.innerHTML = FEATHERS[t.id]; document.body.appendChild(f);
    f.animate([{ transform: `translate(${from.left}px,${from.top}px) scale(1.6) rotate(0deg)`, opacity: 1 }, { transform: `translate(${(from.left + to.left) / 2}px,${Math.min(from.top, to.top) - 120}px) scale(2.4) rotate(-200deg)`, opacity: 1, offset: .55 }, { transform: `translate(${to.left - 6}px,${to.top - 6}px) scale(.7) rotate(-360deg)`, opacity: .9 }], { duration: 900, easing: 'cubic-bezier(.3,.7,.3,1)' }).onfinish = () => { f.remove(); if (dot) { dot.classList.remove('pop'); void dot.offsetWidth; dot.classList.add('pop'); } };
  }
  bump(); pts(S.first[t.id] ? 150 : 100); SFX.win(); document.dispatchEvent(new CustomEvent('hp:feather', { detail: { id: t.id, first: !!S.first[t.id], n: feathers() } }));
  if (window.OWL) window.OWL.cheer();
  const n = feathers();
  owl(n === 8 ? (NEST ? 'All eight are home! Look at me now.' : 'All eight! Now look what you have unlocked.') : NEST ? `${cap(t.f)} is back${S.first[t.id] ? ', first try' : ''}! I am wearing it. ${8 - n} to go.` : `${cap(t.f)} is yours${S.first[t.id] ? ', first try' : ''}! ${8 - n} to go.`, 4600);
  if (firsts() >= 3) setTimeout(() => award('sharp'), 1100);
  if (firsts() === 8) setTimeout(() => award('perfect'), 2000);
  if (n === 8 && !S.gold) { S.gold = true; save(); setTimeout(openGold, 1300); }
}

/* ---------- the trail panel ---------- */
const trail = $('#trail');
const openTrail = o => { trail.classList.toggle('open', o); trail.setAttribute('aria-hidden', o ? 'false' : 'true'); if (o) paint(); };
$('#bpill').addEventListener('click', e => { e.stopImmediatePropagation(); if (NEST) { document.dispatchEvent(new CustomEvent('hp:nest')); return; } openTrail(!trail.classList.contains('open')); }, true);
$('#trailClose').addEventListener('click', () => openTrail(false));
document.addEventListener('pointerdown', e => { if (trail.classList.contains('open') && !e.target.closest('#trail, #bpill')) openTrail(false); });   // a click anywhere outside closes it
$('#trailList').addEventListener('click', e => { if (e.target.closest('a')) openTrail(false); });
{ const rb = $('#trailReset'); let sure = 0;
  rb.addEventListener('click', () => {
    if (!sure) { sure = setTimeout(() => { sure = 0; rb.textContent = 'Start over'; rb.classList.remove('sure'); }, 5000); rb.textContent = 'Tap again to clear everything'; rb.classList.add('sure'); return; }
    clearTimeout(sure); try { localStorage.removeItem(KEY); localStorage.removeItem('hp-game-v2'); } catch (e) {}
    try { history.scrollRestoration = 'manual'; } catch (e) {} scrollTo(0, 0); location.replace(location.pathname);
  }); }
$('#trailGold').addEventListener('click', () => { openTrail(false); openGold(); });
addEventListener('keydown', e => { if (e.key === 'Escape') { openTrail(false); $('#gscrim').classList.remove('open'); } });
document.addEventListener('hp:quest', () => setTimeout(() => { paint(); bump(); pts(25); }, 30));

/* a gift or sticker is earned: the owl itself says thank you. If the visitor is away (a link opened in a new tab) or a
   video is covering the page, it waits, and says it the moment they are back. */
function whenBack(fn) { let away = false, tries = 0; const t = setInterval(() => { const busy = document.hidden || !document.hasFocus() || !!$('.scrim.open'); if (busy && ++tries < 3000) { away = away || document.hidden || !document.hasFocus(); return; } clearInterval(t); setTimeout(() => fn(away), away ? 700 : 0); }, 400); }
document.addEventListener('hp:quest', e => { const id = e.detail && e.detail.id; if (!id || id === 'start') return;
  const q = window.HP && window.HP.list ? window.HP.list().find(x => x.id === id) : null, gift = NEST && window.NESTGIFTS ? window.NESTGIFTS[id] : null, name = gift || NAME[id] || (q && q.name) || '';
  whenBack(away => { const O = window.OWL; if (O) { O.cheer(); if (O.flip) O.flip(); } SFX.win();
    const back = away || cameBack; cameBack = false;
    owl(gift ? (back ? `Welcome back! You went and looked, so ${gift.charAt(0).toLowerCase() + gift.slice(1)} goes into my nest. Thank you.` : `${gift} for my nest! Thank you.`) : (back ? `Welcome back! You went and looked. A sticker for you: ${name}.` : `Nicely done. A sticker for you: ${name}.`), 6000, NEST ? () => document.dispatchEvent(new CustomEvent('hp:nest')) : null); }); });

/* a link that leaves the site (an explainer, an essay, MapSDG, a profile): the gift is for going and looking, not for the click.
   Nothing is given at the click. It is given when the visitor comes back, if they were away long enough to have looked.
   If the page never lost them (the link opened behind, or a mail app took it), it is given after a moment. */
let cameBack = false, out = null; const LOOKED = 6000;
document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[data-q]'); if (!a || a.dataset.v) return;
  const id = a.dataset.q; e.stopPropagation();                                   // the page's own click rule would give it at once
  if (window.HP && window.HP.isDone(id)) return;
  if (out) clearTimeout(out.t);
  out = { id, left: 0, t: setTimeout(() => { if (out && out.id === id && !out.left) { out = null; window.HP.complete(id); } }, 3000) };
}, true);
const gone = () => { if (out && !out.left) { out.left = Date.now(); clearTimeout(out.t); } };
const home = () => { if (!out || !out.left || document.hidden) return; const o = out, away = Date.now() - o.left; out = null;
  if (away >= LOOKED) { cameBack = true; setTimeout(() => window.HP.complete(o.id), 500); }
  else setTimeout(() => owl('Back already? Go and have a proper look. Something for my nest will be waiting.', 5200), 500); };
addEventListener('blur', gone); addEventListener('focus', home);
document.addEventListener('visibilitychange', () => { if (document.hidden) gone(); else home(); });

/* stickers that come from the page's own actions: say so in plain words */
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { const s = n.querySelector && n.querySelector('small'); if (!s) return; if (/Level up/.test(s.textContent)) { n.style.display = 'none'; return; } if (/Badge/.test(s.textContent)) { s.textContent = NEST ? 'A gift for the nest' : 'Sticker earned · +25'; const b = n.querySelector('b'), q = b && window.HP && window.HP.list ? window.HP.list().find(x => x.name === b.textContent) : null; const nm = q && (NEST && window.NESTGIFTS ? window.NESTGIFTS[q.id] : NAME[q.id]); if (nm) b.textContent = nm; else if (NEST && q) n.style.display = 'none'; } }))).observe($('#toasts'), { childList: true });

/* stickers from the trail itself */
const OWLSAYS = [NEST ? 'Hoo! You found me. That is one of my surprises.' : 'Hoo! You found me. Have a sticker.', 'That tickles.', 'Feathers are won, not plucked.', 'Hoo hoo. Keep scrolling, friend.', 'I see everything from up here.'];
let taps = 0;
document.addEventListener('hp:owl', () => {
  const O = window.OWL, wasAsleep = asleep; wake(); if (O && O.flip) O.flip(); SFX.hoot();
  const miss = TRAIL.find(t => !S.got[t.id]); taps++;
  owl(!S.st.owl ? OWLSAYS[0] : wasAsleep ? 'Hoo? I was only resting my eyes.' : taps % 2 && miss ? `You are still missing ${miss.f}. It is on the ${miss.name} island. Tap here and I will take you.` : OWLSAYS[1 + (taps >> 1) % (OWLSAYS.length - 1)], taps % 2 && miss && S.st.owl && !wasAsleep ? 7000 : 4200, taps % 2 && miss && S.st.owl && !wasAsleep ? () => toQuestion(miss.id) : null);
  award('owl');
});
/* it greets each island the first time the visitor lands there */
const YEARS = new Date().getFullYear() - 2000;
const GREET = { w1: 'Sixteen plates on this island. Pick one and it plays right here.', w2: 'Meet Paavam. Ask it anything and watch it try.', w3: 'Press play on the jukebox. I like to dance.', w4: 'Tap the book and it turns over.', w5: `${YEARS} years of building, all on one island.`, w6: 'These explainers are made to be played with.', w7: 'Long reads live here. Bring a tea.', p2: 'Last island. This is where you say hello to Hari.' };
const greeted = {}; let greetT;
document.addEventListener('hp:stop', e => { clearTimeout(greetT); const t = TRAIL[e.detail.i]; if (!t || greeted[t.id]) return;
  greetT = setTimeout(() => { greeted[t.id] = 1; if (S.got[t.id]) owl(`You already have ${t.f} from here.`, 4200); else owl(GREET[t.id] + ' My question is at the end. Tap here to jump to it.', 6500, () => toQuestion(t.id)); }, 900); });
/* it dozes off when nothing happens, and dances when a song plays */
let asleep = false, idleT;
function wake() { clearTimeout(idleT); idleT = setTimeout(() => { asleep = true; if (window.OWL && window.OWL.sleep) window.OWL.sleep(true); owl('Zzz...', 5000); }, 40000); if (asleep) { asleep = false; if (window.OWL && window.OWL.sleep) window.OWL.sleep(false); } }
['pointerdown', 'pointermove', 'keydown', 'scroll', 'wheel', 'touchstart'].forEach(ev => addEventListener(ev, () => { const was = asleep; wake(); if (was && ev !== 'pointerdown') owl('Oh! You are back.', 2600); }, { passive: true }));
wake();
{ const juke = $('#juke'); let danced = false; if (juke) new MutationObserver(() => { const on = juke.classList.contains('playing'); if (window.OWL && window.OWL.dance) window.OWL.dance(on); if (on && !danced) { danced = true; owl('Now this I can dance to.', 3600); } }).observe(juke, { attributes: true, attributeFilter: ['class'] }); }
$$('.tea').forEach(b => b.addEventListener('click', () => award('tea')));
let sawEnd = false;
addEventListener('scroll', () => { if (S.st.nest) return; const doc = document.documentElement; if (scrollY + innerHeight > doc.scrollHeight - innerHeight * .4) sawEnd = true; else if (sawEnd && scrollY < 60) { award('nest'); owl(NEST ? 'Back to the nest. That is one of my surprises.' : 'Back to the nest. That earns a secret sticker.', 4600); } }, { passive: true });
setTimeout(() => { const h = new Date().getHours(); if (h >= 22 || h < 5) award('night'); }, 9000);

/* ---------- the golden feather: a card to keep ---------- */
const gs = $('#gscrim'), cv = $('#gcard');
const pic = svg => { const i = new Image(); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg ', '<svg width="96" height="96" ')); return i; };
const PICS = TRAIL.map(t => pic(FEATHERS[t.id])), GOLDPIC = pic(GOLD);
function drawCard() {
  const x = cv.getContext('2d'), W = cv.width, H = cv.height, name = ($('#gname').value || '').trim().slice(0, 26);
  x.fillStyle = '#F4B41A'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#F8C749'; for (let k = 0; k < 40; k += 2) { x.beginPath(); x.moveTo(W * .5, H * .4); const a0 = k * Math.PI / 20, a1 = (k + 1) * Math.PI / 20; x.lineTo(W * .5 + Math.cos(a0) * 1600, H * .4 + Math.sin(a0) * 1600); x.lineTo(W * .5 + Math.cos(a1) * 1600, H * .4 + Math.sin(a1) * 1600); x.fill(); }
  x.fillStyle = 'rgba(255,255,255,.3)'; for (let j = 12; j < H; j += 24) for (let i = (j / 24 % 2) * 12; i < W; i += 24) { x.beginPath(); x.arc(i, j, 3, 0, 7); x.fill(); }
  x.lineWidth = 12; x.strokeStyle = INK; x.strokeRect(18, 18, W - 36, H - 36);
  const card = (y, h, rot, fill) => { x.save(); x.translate(W / 2, y); x.rotate(rot); x.fillStyle = fill; x.fillRect(-W * .39, -h / 2, W * .78, h); x.restore(); };
  x.textAlign = 'center';
  x.fillStyle = INK; x.font = '26px "Silkscreen"'; x.fillText('HARIPRAV.IN · THE OWL\'S TRAIL', W / 2, 88);
  card(170, 104, -.03, INK); x.save(); x.translate(W / 2, 170); x.rotate(-.03); x.fillStyle = '#fff'; x.font = '800 74px "Baloo 2"'; x.fillText('GOLDEN FEATHER', 0, 26, W * .72); x.restore();
  if (GOLDPIC.complete && GOLDPIC.naturalWidth) x.drawImage(GOLDPIC, W / 2 - 92, 236, 184, 184);
  /* the eight that earned it */
  const fs = 58, gap = 14, x0 = (W - (8 * fs + 7 * gap)) / 2;
  PICS.forEach((im, k) => { const px = x0 + k * (fs + gap); x.fillStyle = '#FFFDF6'; x.fillRect(px, 438, fs, fs); x.lineWidth = 4; x.strokeStyle = INK; x.strokeRect(px, 438, fs, fs); if (im.complete && im.naturalWidth) x.drawImage(im, px + 7, 445, fs - 14, fs - 14); });
  x.fillStyle = INK; x.font = '800 44px "Baloo 2"'; x.fillText(name ? name : 'A curious visitor', W / 2, 562, W - 120);
  x.font = '600 27px "Baloo 2"'; x.fillText('found all 8 feathers in Hari Pravin\'s world', W / 2, 600, W - 100);
  card(668, 80, .02, '#D63A2F'); x.save(); x.translate(W / 2, 668); x.rotate(.02); x.fillStyle = '#fff'; x.font = '800 40px "Baloo 2"'; x.fillText(NEST && window.NESTRANK ? `The owl's ${window.NESTRANK().toLowerCase()}` : `Score ${score()} · ${stickers()} of ${TOTAL_ST} stickers`, 0, 14, W * .72); x.restore();
  x.fillStyle = INK; x.font = '24px "Silkscreen"'; x.fillText(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase(), W / 2, 752);
}
[GOLDPIC, ...PICS].forEach(im => im.addEventListener('load', () => { if (gs.classList.contains('open')) drawCard(); }));
function openGold() { paint(); drawCard(); gs.classList.add('open'); SFX.gold(); document.dispatchEvent(new CustomEvent('hp:gold')); if (window.OWL) window.OWL.cheer(); }
$('#gname').addEventListener('input', drawCard);
$('#gsave').addEventListener('click', () => { drawCard(); cv.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'golden-feather-hariprav-in.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }); award('keeper'); });
$$('[data-gclose]').forEach(b => b.addEventListener('click', () => gs.classList.remove('open')));
gs.addEventListener('click', e => { if (e.target === gs) gs.classList.remove('open'); });
$$('[data-gold]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openGold(); }));
const hook = $('#hookBtn'); if (hook) hook.addEventListener('click', e => { if (feathers() === 8) { e.preventDefault(); openGold(); } });

window.TG = { TRAIL, FEATHERS, GOLD, EXTRA, S: () => S, score, feathers, firsts, openGold,
  reset() { try { localStorage.removeItem(KEY); localStorage.removeItem('hp-game-v2'); } catch (e) {} try { history.scrollRestoration = 'manual'; } catch (e) {} scrollTo(0, 0); location.replace(location.pathname); } };
paint();
setTimeout(() => { if (scrollY < 80) owl(feathers() ? (NEST ? `Welcome back. ${feathers()} of my 8 feathers are home.` : `Welcome back. You have ${feathers()} of 8 feathers.`) : (NEST ? 'Hoo! I have lost my eight feathers, one on each island. Scroll, and I will fly with you.' : 'Hoo! I have hidden eight feathers out here, no two alike. Scroll, and I will fly with you.'), 6500); }, reduce ? 300 : 2600);
})();
