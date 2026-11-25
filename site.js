/* Hari Pravin · the game · mockup v2 */
(() => {
'use strict';
document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- icons ---------- */
const I = {
  start: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  plate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/></svg>',
  paavam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21v-9"/><path d="M12 12C12 7 8.5 5 4 5c0 4.5 3 7 8 7zM12 12c0-4 2.500-6 8-6 0 4-3 6-8 6z"/></svg>',
  song: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5" fill="currentColor"/><circle cx="17.500" cy="16" r="2.5" fill="currentColor"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5c3-1.500 6-1.500 9 .5 3-2 6-2 9-.5v14c-3-1.500-6-1.500-9 .5-3-2-6-2-9-.5z"/><path d="M12 5.500v14"/></svg>',
  work: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.500 2L5 13.500h5.500L9.500 22 19 10h-5.500z"/></svg>',
  lab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/><path d="M7.500 15h9"/></svg>',
  scroll: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h11a2 2 0 012 2v14a2 2 0 01-2 2H6z"/><path d="M6 3a2 2 0 00-2 2v2h2M9.500 8.500h6M9.500 12.500h6M9.500 16.500h3.500"/></svg>',
  hello: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.500"/><path d="M3.500 7l8.500 6.500L20.500 7"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.500 12.500l5 5 10-11"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.500" width="14" height="10" rx="2.500"/><path d="M8 10.500V8a4 4 0 018 0v2.500"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>'
};
const TRAY = '<svg viewBox="0 0 100 76"><rect x="3" y="3" width="94" height="70" rx="12" fill="#D9DEE3" stroke="#1A1512" stroke-width="4"/><rect x="12" y="12" width="46" height="22" rx="6" fill="#C2C9D0" stroke="#1A1512" stroke-width="3"/><rect x="64" y="12" width="24" height="22" rx="6" fill="#C2C9D0" stroke="#1A1512" stroke-width="3"/><rect x="12" y="40" width="76" height="24" rx="6" fill="#C2C9D0" stroke="#1A1512" stroke-width="3"/></svg>';

/* ---------- game data ---------- */
const QUESTS = [
  {id:'start',  badge:'Explorer',      xp:50,  c:'#D63A2F', todo:'Press START',                 at:'#top'},
  {id:'plate',  badge:'Tiffin Taster', xp:100, c:'#F4B41A', todo:'Clear a plate in World 1',    at:'#w1'},
  {id:'paavam', badge:'AI Tamer',      xp:100, c:'#2FA36B', todo:'Ask Paavam a question',       at:'#w2'},
  {id:'song',   badge:'Lyricist',      xp:100, c:'#C2398B', todo:'Play a song on the jukebox',  at:'#w3'},
  {id:'book',   badge:'Author',        xp:100, c:'#4A5FC1', todo:'Flip the book over',          at:'#w4'},
  {id:'work',   badge:'Techie',        xp:100, c:'#1A1512', todo:'Open the main campaign',      at:'#w5'},
  {id:'lab',    badge:'Researcher',    xp:150, c:'#43A35B', todo:'Enter a side quest',          at:'#w6'},
  {id:'scroll', badge:'Reader',        xp:100, c:'#8A5A2B', todo:'Open a scroll',               at:'#w7'},
  {id:'hello',  badge:'Collaborator',  xp:100, c:'#D63A2F', todo:'Say hello',                   at:'#p2'}
];
const TOTAL = QUESTS.reduce((s, q) => s + q.xp, 0);
const LEVELS = [[0,'Visitor'],[150,'Explorer'],[350,'Regular'],[600,'Insider'],[TOTAL,'Player 2']];
const WORLD_Q = {w1:'plate', w2:'paavam', w3:'song', w4:'book', w5:'work', w6:'lab', w7:'scroll', p2:'hello'};

const ROUNDS = [
  {n:1, name:'அஸ்திவாரமும் அடையாளமும்', gl:'Self',           c:'var(--turmeric)', w:false, st:'Round complete'},
  {n:2, name:'உறவுகளும் இணக்கமும்',      gl:'Relationships',  c:'var(--leaf)',     w:true,  st:'Round complete'},
  {n:3, name:'மனநிலையும் உணர்வுகளும்',   gl:'The inner mind', c:'var(--indigo)',   w:true,  st:'Coming next', pale:true},
  {n:4, name:'கொண்டாட்டமும் நிறைவும்',   gl:'Celebration',    c:'var(--magenta)',  w:true,  st:'Locked', pale:true}
];
let PLATES = [
  ['WYRr4XHEX-k','5:11','திறமை இருந்தும் லைஃப் ஏன் சப்புன்னு இருக்கு?'],
  ['46F763rJt_w','5:49','பத்து பாராட்டை விட, ஒரு குறை ஏன் இவ்வளவு வலிக்குது?'],
  ['pOZ0IpJpg5Y','5:24','திட்டம் தெளிவாத்தான் இருக்கு. ஏன் ஒண்ணுமே நடக்கல?'],
  ['pHGH7Zq62xA','5:22','வீட்டுல இருந்தா கிளம்பணும். கிளம்பினா வீடு வேணும்!'],
  ['r_zgxTd2n8g','6:11','வளைந்து கொடுக்கும் சப்பாத்தியும், உணர்வைக் கொட்டும் குருமாவும்'],
  ['DBUNHumABRM','8:30','தனித்து நிற்கும் ஆப்பமும், மாற்ற நினைக்காத தேங்காய்ப் பாலும்'],
  ['inc5IapNf2A','7:56','இழைகளால் தாங்கும் இடியாப்பமும், ருசி கொடுக்கும் வடகறியும்'],
  ['IHEsJcUp4pI','11:09','வேற்றுமையில் ஒற்றுமை தரும் காய்கறி கிச்சடி']
];
const TRACKS = [
  ['kU-EvOG246k','ஏன், ஏன், ஏன்...','A Children\'s Day song to spark scientific temper','1.5K views','3:26','Latest'],
  ['1BwyGIR-Dr8','I Am Love · நான் தான் காதல்','A Tamil love song, Sangam to 2050','1.3K views','5:02','Love'],
  ['aJZum1qedp8','விதைக்குள் ஒரு காடு','Forest in a Seed','12K views','3:04','Inspiration'],
  ['Lg2o88z7kas','வரிசைகள்','Varisaigal, a motivational song','11K views','4:31','Motivation'],
  ['NhCOsFlsMmY','நிலா நிலா ஓடி வா','The Farside Symphony, an Artemis II tribute','3K views','3:51','Science'],
  ['LJM9xkKI2ts','நாளாம் நாளாம் திருநாளாம்','A Pongal anthem for farmers','4.2K views','4:21','Festival'],
  ['hILqjDFDXL4','பத்த வச்சா போதும்!','Light Me Up, a Deepavali song','864 views','3:43','Festival'],
  ['cLs7JNYxYE4','Vibe Check 2026','A new year kuthu anthem','48K views','4:01','New Year']
];

/* ---------- state ---------- */
const KEY = 'hp-game-v2';
let S = {done:{}, cleared:{}, sound:false};
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const xp = () => QUESTS.reduce((s, q) => s + (S.done[q.id] ? q.xp : 0), 0);
const level = (v = xp()) => { let i = 0; LEVELS.forEach((l, k) => { if (v >= l[0]) i = k; }); return i; };

/* ---------- the owl ---------- */
const owlSVG = () => `<svg class="owl" viewBox="0 0 240 262" aria-hidden="true">
<g stroke="#1A1512" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
<path d="M58 72L40 14l64 30z" fill="#4A5FC1"/><path d="M182 72l18-58-64 30z" fill="#4A5FC1"/>
<path class="wing wl" d="M42 126C12 150 12 202 46 224c10-28 12-64 6-94z" fill="#3A4CA3"/>
<path class="wing wr" d="M198 126c30 24 30 76-4 98-10-28-12-64-6-94z" fill="#3A4CA3"/>
<path d="M120 32C62 32 34 78 34 142s34 104 86 104 86-40 86-104S178 32 120 32z" fill="#4A5FC1"/>
<path d="M120 162c-28 0-44 20-44 43s18 35 44 35 44-12 44-35-16-43-44-43z" fill="#FFF6E3" stroke-width="5"/>
<path d="M100 192l8 7 8-7M124 192l8 7 8-7M112 213l8 7 8-7" fill="none" stroke="#4A5FC1" stroke-width="5"/>
<path d="M120 72C96 52 46 62 46 108c0 40 40 52 74 32 34 20 74 8 74-32 0-46-50-56-74-36z" fill="#FFF6E3" stroke="none"/>
<circle cx="86" cy="108" r="30" fill="#F4E3BC"/><circle cx="154" cy="108" r="30" fill="#F4E3BC"/>
<path d="M116 106h8" fill="none"/>
<path d="M120 126l-13 13q13 16 26 0z" fill="#F4B41A" stroke-width="5"/>
<ellipse cx="96" cy="249" rx="17" ry="8" fill="#F4B41A" stroke-width="5"/><ellipse cx="144" cy="249" rx="17" ry="8" fill="#F4B41A" stroke-width="5"/>
</g>
<g class="lid"><circle cx="86" cy="108" r="26" fill="#fff"/><g class="pupil"><circle cx="86" cy="108" r="12.500" fill="#1A1512"/><circle cx="81" cy="103" r="4.200" fill="#fff"/></g></g>
<g class="lid"><circle cx="154" cy="108" r="26" fill="#fff"/><g class="pupil"><circle cx="154" cy="108" r="12.500" fill="#1A1512"/><circle cx="149" cy="103" r="4.200" fill="#fff"/></g></g>
</svg>`;
$$('[data-owl]').forEach(el => { el.innerHTML = owlSVG(); });
const owls = $$('.owl');
/* every pair of eyes blinks on its own clock */
owls.forEach(o => {
  const tick = () => { o.classList.add('blink'); setTimeout(() => o.classList.remove('blink'), 130); setTimeout(tick, 3400 + Math.random() * 3200); };
  setTimeout(tick, 1200 + Math.random() * 3000);
});
const trackers = $$('[data-owl="track"] .owl');
let mx = innerWidth / 2, my = innerHeight / 2, raf = 0;
const look = () => {
  raf = 0;
  trackers.forEach(o => {
    const r = o.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    const dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height * .42);
    const d = Math.hypot(dx, dy) || 1, f = Math.min(1, d / 260) * 9;
    $$('.pupil', o).forEach(p => p.setAttribute('transform', `translate(${(dx / d * f).toFixed(1)} ${(dy / d * f).toFixed(1)})`));
  });
};
addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(look); }, {passive:true});
const hoot = () => { if (reduce) return; owls.forEach(o => { o.classList.remove('hoot'); void o.getBoundingClientRect(); o.classList.add('hoot'); setTimeout(() => o.classList.remove('hoot'), 1300); }); };

/* ---------- sound ---------- */
let ac;
const tone = (f, t, d, type = 'square', v = .05) => {
  if (!S.sound) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f; g.gain.value = v;
    g.gain.setValueAtTime(v, ac.currentTime + t); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + t + d);
    o.connect(g).connect(ac.destination); o.start(ac.currentTime + t); o.stop(ac.currentTime + t + d + .02);
  } catch (e) {}
};
const sfx = {
  tap: () => tone(620, 0, .05),
  ok: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .09, .16)),
  up: () => [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * .07, .2, 'triangle', .08)),
  roll: () => [0,1,2,3,4,5].forEach(i => tone(300 + Math.random() * 500, i * .09, .05))
};
const snd = $('#snd');
const paintSnd = () => snd.setAttribute('aria-pressed', S.sound ? 'true' : 'false');
snd.addEventListener('click', () => { S.sound = !S.sound; save(); paintSnd(); sfx.ok(); });
paintSnd();

/* ---------- confetti ---------- */
const fx = $('#fx'), ctx = fx.getContext('2d'); let parts = [], fxRaf = 0;
const sizeFx = () => { const d = Math.min(2, devicePixelRatio || 1); fx.width = innerWidth * d; fx.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
sizeFx(); addEventListener('resize', sizeFx);
const COLORS = ['#F4B41A', '#D63A2F', '#43A35B', '#4A5FC1', '#C2398B', '#FFF6E3', '#1A1512'];
const burst = (x, y, n = 70, spread = Math.PI, dir = -Math.PI / 2) => {
  if (reduce) return;
  for (let i = 0; i < n; i++) {
    const a = dir + (Math.random() - .5) * spread, v = 6 + Math.random() * 11;
    parts.push({x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: 6 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - .5) * .5, c: COLORS[i % COLORS.length], life: 1, sq: Math.random() > .4});
  }
  if (!fxRaf) fxRaf = requestAnimationFrame(stepFx);
};
function stepFx() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 40);
  parts.forEach(p => {
    p.vy += .38; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= .011;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.min(1, p.life * 2.5); ctx.fillStyle = p.c;
    if (p.sq) ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .66); else { ctx.beginPath(); ctx.arc(0, 0, p.s / 2.4, 0, 7); ctx.fill(); }
    ctx.restore();
  });
  fxRaf = parts.length ? requestAnimationFrame(stepFx) : 0;
}

/* ---------- toasts ---------- */
const toast = (small, big, icon, c) => {
  const t = document.createElement('div'); t.className = 'toast';
  t.innerHTML = `<span class="star" style="--bc:${c}">${icon}</span><span><small class="pixel">${small}</small><b>${big}</b></span>`;
  $('#toasts').appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 3600);
};

/* ---------- HUD, log and guide ---------- */
const guide = $('#guide'); let quietT;
const tell = (text, label) => document.dispatchEvent(new CustomEvent('hp:say', {detail:{text, label}}));
const say = txt => { tell(txt, 'Next quest'); $('#guideTxt').textContent = txt; guide.classList.remove('quiet'); clearTimeout(quietT); quietT = setTimeout(() => guide.classList.add('quiet'), 7000); };
$('#guideOwl').addEventListener('mouseenter', () => { guide.classList.remove('quiet'); clearTimeout(quietT); quietT = setTimeout(() => guide.classList.add('quiet'), 4000); });

function paint() {
  const v = xp(), li = level(v), pct = (v / TOTAL * 100).toFixed(1) + '%';
  $('#lv').textContent = li + 1; $('#xptxt').textContent = v + ' XP'; $('#xpfill').style.width = pct;
  $('#logLv').textContent = `Lv ${li + 1} · ${LEVELS[li][1]}`; $('#logXp').textContent = `${v} / ${TOTAL} XP`; $('#logFill').style.width = pct;
  $('#ql').innerHTML = QUESTS.map(q => `<li class="${S.done[q.id] ? 'done' : ''}"><a href="${q.at}"><span class="ic">${S.done[q.id] ? I.check : I[q.id]}</span><span><b>${q.todo}</b><span>${S.done[q.id] ? 'Done' : 'Badge: ' + q.badge}</span></span><span class="pixel">+${q.xp}</span></a></li>`).join('');
  $('#badges').innerHTML = QUESTS.map(q => `<div class="bdg ${S.done[q.id] ? 'got' : ''}" style="--bc:${q.c}"><div class="star">${S.done[q.id] ? I[q.id] : I.lock}</div><small>${q.badge}</small></div>`).join('');
  $$('.quest[data-q]').forEach(el => {
    const q = QUESTS.find(x => x.id === el.dataset.q), d = !!S.done[q.id];
    el.classList.toggle('done', d); $('.q-ic', el).innerHTML = d ? I.check : I[q.id];
    $('small', el).textContent = d ? `Cleared · ${q.badge} badge` : `Quest · +${q.xp} XP`;
  });
  $$('.hud-worlds a').forEach(a => a.classList.toggle('done', !!S.done[WORLD_Q[a.dataset.w]]));
  $$('.plate[data-v]').forEach(p => p.classList.toggle('cleared', !!S.cleared[p.dataset.v]));
  const any = Object.keys(S.done).length > 0;
  const next = QUESTS.find(q => !S.done[q.id] && (q.id !== 'start' || !any)) || QUESTS.find(q => !S.done[q.id]);
  const all = !next;
  $('#guideSay small').textContent = all ? 'Game complete' : 'Next quest';
  $('#finalChip').textContent = all ? 'All 9 quests cleared · you are Player 2' : 'Final level · co-op mode';
  if (all) $('#finalLead').textContent = 'You cleared every quest, so you already know how I think and work. That makes you Player 2. Shall we start a co-op game?';
  if (all) $('#finalSay').textContent = 'Hoo hoo! Full marks. Now say hello.';
  return next;
}
function complete(id) {
  if (S.done[id]) return;
  const q = QUESTS.find(x => x.id === id); if (!q) return;
  const before = level();
  S.done[id] = 1; save();
  const next = paint();
  toast('Badge unlocked · +' + q.xp + ' XP', q.badge, I[q.id], q.c);
  hoot(); sfx.ok();
  document.dispatchEvent(new CustomEvent('hp:quest', {detail:{id, badge:q.badge}}));
  burst(90, innerHeight - 70, 60, 1.5, -Math.PI / 3);
  const after = level();
  if (after > before) setTimeout(() => { toast('Level up', `Lv ${after + 1} · ${LEVELS[after][1]}`, I.start, '#F4B41A'); sfx.up(); }, 900);
  if (!next) { setTimeout(() => { burst(innerWidth * .25, innerHeight * .6, 110, 2.4); burst(innerWidth * .75, innerHeight * .6, 110, 2.4); sfx.up(); }, 500); say('All quests done. You are Player 2 now!'); }
  else say(next.todo + '.');
}
const log = $('#log');
const openLog = o => { log.classList.toggle('open', o); log.setAttribute('aria-hidden', o ? 'false' : 'true'); if (o) sfx.tap(); };
$('#openLog').addEventListener('click', () => openLog(!log.classList.contains('open')));
$('#guideOwl').addEventListener('click', () => openLog(!log.classList.contains('open')));
$('#closeLog').addEventListener('click', () => openLog(false));
$('#ql').addEventListener('click', e => { if (e.target.closest('a')) openLog(false); });
$('#reset').addEventListener('click', () => { if (confirm('Reset your XP and badges on this device?')) { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); } });

/* ---------- video modal ---------- */
const vscrim = $('#vscrim'), sscrim = $('#sscrim'), cscrim = $('#cscrim');
function openVideo(id, title, quest) {
  $('#vtitle').textContent = title || '';
  $('#vlink').href = 'https://youtu.be/' + id;
  $('#vframe').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="Video player" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  vscrim.classList.add('open'); sfx.tap();
  if (PLATES.some(p => p[0] === id)) { S.cleared[id] = 1; save(); }
  if (quest) complete(quest); else paint();
}
const closeAll = () => { vscrim.classList.remove('open'); $('#vframe').innerHTML = ''; sscrim.classList.remove('open'); cscrim.classList.remove('open'); $('#bscrim').classList.remove('open'); openLog(false); };
$$('[data-close]').forEach(b => b.addEventListener('click', closeAll));
[vscrim, sscrim, cscrim, $('#bscrim')].forEach(s => s.addEventListener('click', e => { if (e.target === s) closeAll(); }));
addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

/* ---------- world 1: level select ---------- */
const LOCAL_THUMBS = new Set(PLATES.map(p => p[0]));
const thumb = id => LOCAL_THUMBS.has(id) ? `assets/thumbs/${id}.jpg` : `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
function renderRounds() {
  let nextFound = false;
  $('#rounds').innerHTML = ROUNDS.map(r => {
    let out = 0;
    const tiles = [0, 1, 2, 3].map(k => {
      const n = (r.n - 1) * 4 + k + 1, p = PLATES[n - 1];
      if (p) out++;
      return p
        ? `<button class="plate" data-v="${p[0]}" data-t="தட்டு ${n} · ${p[2]}" data-q="plate" title="${p[2]}"><figure><img src="${thumb(p[0])}" alt="" loading="lazy"><span class="playdot">${I.play}</span><span class="tick">${I.check}</span></figure><span class="meta"><span>தட்டு ${n}</span><small>${p[1] || 'new'}</small></span></button>`
        : `<div class="plate lock" aria-label="Plate ${n}, not yet released"><figure>${TRAY}</figure><span class="meta"><span>தட்டு ${n}</span><small>soon</small></span></div>`;
    }).join('');
    const plain = document.body.classList.contains('blend');           // on the plain-worded page these describe what is published, not what the visitor has done
    let st = out === 4 ? (plain ? 'All 4 out' : '✓ Round complete') : out ? `${out} of 4 out` : nextFound ? (plain ? 'Later' : 'Locked') : 'Coming next';
    if (out < 4) nextFound = true;
    return `<div class="round rv in ${out ? '' : 'pale'}"><div class="strap ${r.w ? 'w' : ''}" style="--rc:${r.c}"><span class="pixel">Round ${r.n}</span><h3>${r.name}</h3><span class="gl">${r.gl}</span><span class="st">${st}</span></div><div class="plates">${tiles}</div></div>`;
  }).join('');
}
renderRounds();

document.addEventListener('click', e => {
  const v = e.target.closest('[data-v]');
  if (v) { e.preventDefault(); openVideo(v.dataset.v, v.dataset.t, v.dataset.q || (v.closest('#w2') ? 'paavam' : null)); return; }
  const q = e.target.closest('a[data-q]');
  if (q) complete(q.dataset.q);
});

/* ---------- world 2: Paavam chat ---------- */
const chatBody = $('#chatBody'); let chatBusy = false;
const wait = ms => new Promise(r => setTimeout(r, reduce ? 60 : ms));
const addMsg = (cls, html) => { const m = document.createElement('div'); m.className = 'msg ' + cls; m.innerHTML = html; chatBody.appendChild(m); while (chatBody.children.length > 5) chatBody.firstChild.remove(); return m; };
$$('.ask').forEach(b => b.addEventListener('click', async () => {
  if (chatBusy) return; chatBusy = true; $$('.ask').forEach(x => x.disabled = true);
  chatBody.innerHTML = ''; sfx.tap();
  addMsg('me', b.textContent);
  await wait(500); let t = addMsg('pv', '<span class="typing"><i></i><i></i><i></i></span>');
  await wait(1100); t.innerHTML = 'இது ரொம்ப ஈஸி!'; sfx.tap();
  await wait(700); t = addMsg('pv', '<span class="typing"><i></i><i></i><i></i></span>');
  await wait(2300); t.innerHTML = 'நான் பாவம்.'; tone(180, 0, .35, 'sawtooth', .05);
  await wait(700);
  const m = addMsg('sys', `<span>A human solves it in Ep. ${b.dataset.n}.</span><button class="btn sm dark" data-v="${b.dataset.ep}" data-t="பாவம் AI · Ep. ${b.dataset.n}">Watch</button>`);
  complete('paavam');
  chatBusy = false; $$('.ask').forEach(x => x.disabled = false);
}));

/* ---------- world 3: jukebox ---------- */
const juke = $('#juke'), screen = $('#screen'); let cur = 0;
$('#tracks').innerHTML = TRACKS.map((t, i) => `<button class="trk ${i ? '' : 'on'}" data-i="${i}"><span class="n">${String(i + 1).padStart(2, '0')}</span><img src="assets/thumbs/${t[0]}.jpg" alt="" loading="lazy"><span><b>${t[1]}</b><small>${t[2]}</small></span><span class="d">${t[4]}</span></button>`).join('');
function load(i, play) {
  cur = i; const t = TRACKS[i];
  $$('.trk').forEach((b, k) => b.classList.toggle('on', k === i));
  $('#npTitle').textContent = t[1]; $('#npSub').textContent = `${t[2]} · ${t[3]}`; $('#npTag').textContent = (play ? 'Now playing · ' : 'Now loaded · ') + t[5];
  if (play) {
    screen.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${t[0]}?autoplay=1&rel=0" title="${t[1]}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    juke.classList.add('playing'); complete('song');
  } else {
    screen.innerHTML = `<img src="assets/thumbs/${t[0]}.jpg" alt=""><span class="playdot" style="opacity:1;transform:none">${I.play}</span>`;
    juke.classList.remove('playing');
  }
}
screen.addEventListener('click', () => { if (!juke.classList.contains('playing')) load(cur, true); });
$('#tracks').addEventListener('click', e => { const b = e.target.closest('.trk'); if (b) { sfx.tap(); load(+b.dataset.i, true); } });

/* ---------- world 4: book ---------- */
$('#flip').addEventListener('click', () => { $('#flip').classList.toggle('turned'); sfx.tap(); complete('book'); });

/* ---------- start, dice, speedrun ---------- */
$('#start').addEventListener('click', () => {
  $('#heroSay').textContent = 'Game on! World 1 is just below.'; tell('Game on! Follow me to World 1.');
  complete('start');
  setTimeout(() => $('#w1').scrollIntoView({behavior: reduce ? 'auto' : 'smooth'}), 650);
});
const FACES = {1:[4], 2:[0,8], 3:[0,4,8], 4:[0,2,6,8], 5:[0,2,4,6,8], 6:[0,2,3,5,6,8]};
const die = $('#die'); const face = n => $$('i', die).forEach((p, k) => p.classList.toggle('p', FACES[n].includes(k)));
let rolling = false;
$('#dice').addEventListener('click', () => {
  if (rolling) return; rolling = true; sfx.roll();
  die.classList.remove('roll'); void die.offsetWidth; die.classList.add('roll');
  let k = 0; const iv = setInterval(() => { face(1 + Math.floor(Math.random() * 6)); if (++k > 6) { clearInterval(iv); pick(); } }, 90);
});
function pick() {
  const pool = [...PLATES.map((p, i) => [p[0], `தட்டு ${i + 1} · ${p[2]}`, 'plate']), ...TRACKS.map(t => [t[0], t[1], 'song']), ['zasPGtjEBGc', 'பாவம் AI · Ep. 1', 'paavam'], ['WRzYeSeW7aA', 'பாவம் AI · Ep. 2', 'paavam']];
  const c = pool[Math.floor(Math.random() * pool.length)];
  $('#heroSay').textContent = 'A lucky pick. Enjoy!'; tell('A lucky pick. Enjoy!');
  setTimeout(() => { rolling = false; openVideo(c[0], c[1], c[2]); }, 350);
}
const t0 = Date.now(); let tIv;
const openSpeed = () => {
  sscrim.classList.add('open'); sfx.tap();
  const tick = () => { const s = Math.floor((Date.now() - t0) / 1000); $('#timer').textContent = `Run time ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  tick(); clearInterval(tIv); tIv = setInterval(() => { if (!sscrim.classList.contains('open')) return clearInterval(tIv); tick(); }, 1000);
};
$('#speedrun').addEventListener('click', openSpeed); $('#speedrun2').addEventListener('click', openSpeed);

/* ---------- marquee ---------- */
const MQ = ['ஆட்டம் ஆரம்பம்', '★', '#டிபன்சைக்காலஜி', '★', 'பாவம் AI', '★', 'AI எனும் நான்', '★', 'MapSDG', '★', 'ஏன், ஏன், ஏன்...', '★', 'I Am Love', '★', 'விதைக்குள் ஒரு காடு', '★'];
$('#mq').innerHTML = [...MQ, ...MQ, ...MQ, ...MQ].map(t => `<span>${t}</span>`).join('');

/* ---------- reveal and world tracking ---------- */
$$('.world').forEach((w, i) => { const g = document.createElement('span'); g.className = 'ghost'; g.setAttribute('aria-hidden', 'true'); g.textContent = i + 1; w.prepend(g); });
const ghosts = $$('.ghost');
const navs = $$('.hud-worlds a'), secs = navs.map(a => $('#' + a.dataset.w));
let sRaf = 0;
function onScroll() {
  sRaf = 0; const h = innerHeight;
  $$('.rv:not(.in)').forEach(el => { if (el.getBoundingClientRect().top < h * .9) el.classList.add('in'); });
  let on = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < h * .45) on = i; });
  navs.forEach((a, i) => a.classList.toggle('on', i === on));
  ghosts.forEach(g => { const r = g.parentElement.getBoundingClientRect(); if (r.bottom > 0 && r.top < h) g.style.setProperty('--p', ((h - r.top) / (h + r.height)).toFixed(3)); });
}
addEventListener('scroll', () => { if (!sRaf) sRaf = requestAnimationFrame(onScroll); }, {passive:true});
addEventListener('resize', onScroll); addEventListener('load', onScroll);

/* ---------- tapes, karaoke, links ---------- */
$$('.tape').forEach(t => { const txt = (t.dataset.tape.replace('{years}', new Date().getFullYear() - 2000) + ' ').repeat(14); t.innerHTML = `<div><p><span>${txt}</span><span>${txt}</span></p></div>`; });
$$('.kara i').forEach((w, k) => w.style.setProperty('--k', k < 4 ? k : k + 1.2));
$$('a[href^="http"]').forEach(a => { if (a.host !== location.host) { a.target = '_blank'; a.rel = 'noopener'; } });

/* ---------- tilt, hero parallax, cursor label ---------- */
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
if (fine && !reduce) {
  $$('.pv-cover, .feat, .tutorial, .camp').forEach(el => el.classList.add('tilt'));
  $$('.tilt, .pcard').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5, k = el.classList.contains('pcard') ? 14 : 6;
      el.style.setProperty('--ry', (x * k).toFixed(2) + 'deg'); el.style.setProperty('--rx', (-y * k).toFixed(2) + 'deg');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); });
  });
  const stage = $('.stage'), hero = $('.hero');
  hero.addEventListener('pointermove', e => { stage.style.setProperty('--px', (e.clientX / innerWidth - .5).toFixed(3)); stage.style.setProperty('--py', (e.clientY / innerHeight - .5).toFixed(3)); });
  const CUR = [['.plate:not(.lock), .tv, .pv-cover, .screen, .trk', 'Play'], ['#flip', 'Flip'], ['.cart, .feat, .art', 'Open'], ['#dice', 'Roll'], ['.ask', 'Ask'], ['.tea', 'Insert'], ['.mode', 'Book']];
  const lab = document.createElement('div'); lab.className = 'curlab'; document.body.appendChild(lab);
  let lx = 0, ly = 0, tx = 0, ty = 0, cRaf = 0, shown = false;
  const moveLab = () => { lx += (tx - lx) * .22; ly += (ty - ly) * .22; lab.style.transform = `translate3d(${(lx + 16).toFixed(1)}px,${(ly + 20).toFixed(1)}px,0)`; cRaf = shown || Math.abs(tx - lx) > .5 ? requestAnimationFrame(moveLab) : 0; };
  addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    let txt = ''; for (const [sel, t] of CUR) if (e.target.closest && e.target.closest(sel)) { txt = t; break; }
    shown = !!txt; if (txt) lab.textContent = txt; lab.classList.toggle('on', shown);
    if (!cRaf) cRaf = requestAnimationFrame(moveLab);
  }, {passive:true});
}

/* ---------- insert coin ---------- */
const UPI = '9840805248@okbizaxis';
$$('.tea').forEach(b => b.addEventListener('click', () => {
  const amt = b.dataset.amt, name = b.dataset.name || 'Tea';
  const params = `pa=${UPI}&pn=Hari%20Pravin&mc=5499&tr=TXN${Math.floor(Math.random() * 1e9)}&am=${amt}&cu=INR&tn=Support%20Hari%20Pravin`;
  const ua = navigator.userAgent, ios = /iPad|iPhone|iPod/.test(ua), android = /Android/.test(ua);
  $('#cAmt').textContent = '₹' + amt; $('#cName').textContent = name; $('#cUpi').textContent = UPI;
  $('#cOpen').href = android ? `intent://pay?${params}#Intent;scheme=upi;end` : ios ? `gpay://upi/pay?${params}` : `upi://pay?${params}`;
  $('#cOpen').style.display = (android || ios) ? '' : 'none';
  try { const q = qrcode(0, 'M'); q.addData('upi://pay?' + params); q.make(); $('#qr').innerHTML = q.createSvgTag({cellSize: 4, margin: 0, scalable: true}); }
  catch (e) { $('#qr').textContent = 'Pay to ' + UPI; }
  cscrim.classList.add('open'); sfx.ok(); tell('Thank you! That keeps the levels coming.');
}));

/* ---------- live facts: years are counted, the rest comes from data.json (tools/refresh.py) ---------- */
const setFact = (k, v) => $$(`[data-fact="${k}"]`).forEach(e => { e.textContent = v; e.dataset.final = v; });
setFact('years', new Date().getFullYear() - 2000); setFact('year', new Date().getFullYear());
fetch('data.json', {cache: 'no-cache'}).then(r => r.ok ? r.json() : null).then(d => {
  if (!d) return;
  if (d.channel) { setFact('subs', d.channel.subscribers); setFact('videos', d.channel.videos); }
  if (d.tiffin && d.tiffin.plates.length) {
    const dur = Object.fromEntries(PLATES.map(p => [p[0], p[1]])), next = [];
    d.tiffin.plates.forEach(p => { next[p.n - 1] = [p.id, dur[p.id] || '', p.title]; });
    PLATES = next; renderRounds();
    $('#tiffinChip').textContent = `Series · ${d.tiffin.plates.length} of ${d.tiffin.total} plates out`;
  }
  if (d.paavam && d.paavam.episodes.length) $('#paavamChip').textContent = `New series · ${d.paavam.episodes.length} episodes`;
  if (d.medium && d.medium.length) {
    const [f, ...rest] = d.medium, local = l => { const i = ['c018ae560b7b', 'c8dea27310a8', 'a9a4cb02ed26', '392692e8a90e', '79bc76a43703', '0fd45c07fc89'].findIndex(x => l.endsWith(x)); return i < 0 ? null : `assets/medium/m${i + 1}.jpg`; };
    $('.scrolls').innerHTML = `<a class="feat card rv in" href="${f.link}" target="_blank" rel="noopener" data-q="scroll"><img src="${local(f.link) || f.image}" alt="" loading="lazy"><div class="tx"><div class="meta-row pixel"><span>Latest</span><span>${f.date}</span><span>${f.minutes} min read</span></div><h3>${f.title}</h3><p>${f.blurb}</p></div></a>
      <div class="art-list">${rest.slice(0, 5).map(a => `<a class="art card rv in" href="${a.link}" target="_blank" rel="noopener" data-q="scroll"><img src="${local(a.link) || a.image}" alt="" loading="lazy"><div class="tx"><div class="meta-row pixel"><span>${a.date}</span><span>${a.minutes} min</span></div><h3>${a.title}</h3></div></a>`).join('')}</div>`;
  }
  if (d.updated) $('#asof').textContent = 'Numbers refreshed ' + new Date(d.updated + 'T00:00:00').toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
  paint();
}).catch(() => {});

/* ---------- booking: a real form. With BOOK_ENDPOINT set it posts there; until then it hands the request to the visitor's email app ---------- */
const BOOK_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyMW6U1Oi0iPyTEcjDsbA0V7PJHz33GxBjc8fztA_Nx_UVP29K1z3rnDljggpmJYXhFow/exec';   // Hari's booking endpoint (tools/booking-endpoint.gs, inside the sheet "hariprav.in Bookings")
const BOOK_TO = 'hello@hariprav.in';
const MODES = {consult: ['Hands-on consultation', 'What should we work on?'], training: ['Group training', 'What should the team learn?'], talk: ['Talk or session', 'What is the occasion and the audience?']};
const bscrim = $('#bscrim'), bForm = $('#bForm'), bModal = $('.bookm');
const setMode = m => { bModal.dataset.mode = m; $('#bTitle').textContent = 'Co-op request · ' + MODES[m][0]; $('#bWhatLab').textContent = MODES[m][1]; };
function openBook(m) { bForm.hidden = false; $('#bDone').hidden = true; $('#bErr').textContent = ''; bForm.mode.value = m; setMode(m); bscrim.classList.add('open'); sfx.tap(); setTimeout(() => bForm.name.focus(), 60); }
$$('[data-book]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openBook(a.dataset.book); }));
$$('input[name="mode"]', bForm).forEach(r => r.addEventListener('change', () => setMode(r.value)));
bForm.addEventListener('submit', async e => {
  e.preventDefault();
  const f = bForm, m = f.mode.value, group = m !== 'consult';
  const bad = [f.name, f.email, f.what].filter(i => !i.value.trim() || (i.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.trim())));
  $$('.fld', f).forEach(x => x.classList.remove('bad')); bad.forEach(i => i.closest('.fld').classList.add('bad'));
  if (bad.length) { $('#bErr').textContent = 'Please fill in your name, a valid email and what you need.'; bad[0].focus(); return; }
  if (f.website.value) return;                              // a filled trap field means a bot
  const ref = 'HP-' + Date.now().toString(36).toUpperCase().slice(-6);
  const req = {ref, mode: MODES[m][0], name: f.name.value.trim(), email: f.email.value.trim(), organisation: f.org.value.trim(), request: f.what.value.trim(), when: f.when.value.trim(), people: group ? f.size.value : '', where: group ? f.where.value : '', page: location.href, sent: new Date().toISOString()};
  const summary = [`Reference: ${ref}`, `Mode: ${req.mode}`, `Name: ${req.name}`, `Email: ${req.email}`, req.organisation && `Organisation: ${req.organisation}`, `Request: ${req.request}`, req.when && `When: ${req.when}`, req.people && `People: ${req.people}`, req.where && `Where: ${req.where}`].filter(Boolean).join('\n');
  $('#bSend').disabled = true; $('#bErr').textContent = '';
  let sent = false;
  if (BOOK_ENDPOINT) { try { const r = await fetch(BOOK_ENDPOINT, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify(req)}); sent = r.ok; } catch (err) { sent = false; } }
  $('#bSend').disabled = false;
  if (BOOK_ENDPOINT && !sent) { $('#bErr').textContent = 'That did not go through. Please try again, or write to ' + BOOK_TO + '.'; return; }
  if (!BOOK_ENDPOINT) location.href = `mailto:${BOOK_TO}?subject=${encodeURIComponent(`Co-op request: ${req.mode} (${ref})`)}&body=${encodeURIComponent(summary)}`;
  $('#bDoneTitle').textContent = sent ? 'Request sent' : 'Almost there';
  $('#bDoneText').textContent = sent ? `Thank you, ${req.name}. Your request ${ref} has reached Hari, and a copy is on its way to ${req.email}. He will reply with dates.` : `Your email app has opened with the request filled in. Press send there and it reaches Hari. Reference ${ref}.`;
  $('#bSummary').textContent = summary; bForm.hidden = true; $('#bDone').hidden = false; bForm.reset();
  complete('hello');
});
$('#bCopy').addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText($('#bSummary').textContent).then(() => { $('#bCopy').textContent = 'Copied'; setTimeout(() => { $('#bCopy').textContent = 'Copy the summary'; }, 1600); }); });

/* ---------- boot and entrance ---------- */
window.HP = {isDone: id => !!S.done[id], complete, openLog: () => openLog(true), count: () => Object.keys(S.done).length,
  list: () => QUESTS.map(q => ({id: q.id, name: q.badge, c: q.c, icon: I[q.id], done: !!S.done[q.id]})), icons: I, toast, tone, sfx,
  sound: v => { if (v !== undefined) { S.sound = !!v; save(); paintSnd(); } return !!S.sound; }};
['.p1', '.title .t1', '.title .t2', '.tagline', '.hero .cta', '.hero-stats', '.disc', '.pcard', '.sticker-aa'].forEach((sel, i) => { const el = $(sel); if (el) { el.setAttribute('data-in', ''); el.style.setProperty('--i', i); } });
const countUp = () => $$('.stat b').forEach(b => {
  const m = b.textContent.match(/^([\d.]+)(.*)$/); if (!m || reduce) return;
  const end = parseFloat(m[1]), dec = m[1].includes('.') ? 1 : 0, t0 = performance.now();
  const step = t => { const k = Math.min(1, (t - t0) / 1100), e = 1 - Math.pow(1 - k, 3); b.textContent = (end * e).toFixed(dec) + m[2]; if (k < 1) requestAnimationFrame(step); else if (b.dataset.final) b.textContent = b.dataset.final; };
  requestAnimationFrame(step);
});
const ready = () => { document.body.classList.add('ready'); setTimeout(countUp, 450); document.dispatchEvent(new CustomEvent('hp:ready')); };
const boot = $('#boot');
if (boot && document.documentElement.classList.contains('booting')) {
  $('.in', boot).insertAdjacentHTML('afterbegin', owlSVG());
  const bar = $('.bar i', boot); let pct = 8; const iv = setInterval(() => { pct = Math.min(92, pct + 9 + Math.random() * 14); bar.style.width = pct + '%'; }, 160);
  const done = () => { clearInterval(iv); bar.style.width = '100%'; setTimeout(() => { boot.classList.add('go'); ready(); setTimeout(() => { boot.style.display = 'none'; document.documentElement.classList.remove('booting'); }, 800); }, 320); };
  const t0 = performance.now();
  const waitBook = cb => { if (window.__bookDone || !document.documentElement.classList.contains('book-try')) return cb(); let f = 0; const go = () => { if (!f) { f = 1; cb(); } }; document.addEventListener('hp:book', go, {once: true}); setTimeout(go, 8000); };
  let finOnce = 0; const fin = () => { if (finOnce) return; finOnce = 1; waitBook(() => setTimeout(done, Math.max(0, 1100 - (performance.now() - t0)))); };
  if (document.readyState === 'complete') fin(); else { addEventListener('load', fin); setTimeout(fin, 3500); }
  try { sessionStorage.setItem('hpBoot', '1'); } catch (e) {}
} else ready();

load(0, false);
const next = paint(); onScroll(); look();
say(next ? (next.id === 'start' ? 'Press START to begin.' : next.todo + '.') : 'All quests done. You are Player 2 now!');
if (S.done.start) $('#heroSay').textContent = 'Welcome back! Your score is safe with me.';
})();
