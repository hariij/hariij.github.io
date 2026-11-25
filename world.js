/* hariprav.in look proof 1 · the world map: one toon world of floating islands, and an owl that flies between them. */
import { THREE, C, hex, WORLDS, toon, flat, ball, box, cyl, cone, torus, group, shadow, print, panel, stage, makeOwl, ease, clamp, lerp } from './kit.js';

const PI = Math.PI, $ = s => document.querySelector(s);
await Promise.all([document.fonts.load('800 30px "Baloo Thambi 2"', 'இது'), document.fonts.load('800 30px "Baloo 2"', 'A')]).catch(() => {});
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const JOURNEY = document.body.classList.contains('journey');           // scroll-only: the page scrolls, the owl follows
const BLEND = document.body.classList.contains('blend');                   // the full site: tall sections beside the islands
const PLAIN = window.SECTIONS ? window.SECTIONS.map(s => s.name) : ['Series', 'பாவம் AI', 'Songs', 'Books', 'Work', 'Experiments', 'Writing', 'Say hello'];
const { renderer, scene, cam } = stage($('#gl'), { fov: 34 });
const live = [];                                             // small motions: each (t) => void
const POS = WORLDS.map((w, i) => new THREE.Vector3(i * 10.5, Math.sin(i * 1.3) * .55, i % 2 ? -2.6 : 2.2));

/* ---------- an island: a slab of colour on a faceted rock ---------- */
function island(i, top) {
  const g = group(scene, { p: POS[i].toArray() });
  cyl(g, 3.35, 3.2, .5, top, { p: [0, -.25, 0], seg: 56 });
  cyl(g, 3.1, .8, 2.4, C.ROCK, { p: [0, -1.7, 0], seg: 9, t: .06 });
  ball(g, .34, C.ROCK, { p: [1.3, -3.25, .2], s: [1, 1.4, 1], seg: 8 }); ball(g, .22, C.ROCK, { p: [-.9, -3.5, -.3], s: [1, 1.5, 1], seg: 8 });
  const hit = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 5.4, 16), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.2; hit.userData.i = i; g.add(hit);
  live.push(t => { g.position.y = POS[i].y + Math.sin(t * .8 + i * 1.7) * .14; g.rotation.z = Math.sin(t * .5 + i) * .012; });
  return g;
}
const puff = (g, x, y, z, k) => { const b = ball(g, .16, flat(C.WHITE, { transparent: true, opacity: .9 }), { p: [x, y, z], t: 0, seg: 12 }); live.push(t => { const u = (t * .45 + k) % 1; b.position.y = y + u * 1.1; b.position.x = x + Math.sin(u * 5 + k * 9) * .1; b.scale.setScalar(.5 + u * .9); b.material.opacity = .85 * (1 - u); }); };

/* 1 · tiffin: a steel plate on a banana leaf, idlis, a cone dosa, a tumbler of filter coffee */
{ const g = island(0, C.TUR);
  ball(g, 1, C.LEAF, { p: [-.1, .05, .2], s: [2.6, .05, 1.75], r: [0, .3, 0], t: .03 }); box(g, 4.6, .03, .07, flat(C.LEAF_D), { p: [-.1, .11, .2], r: [0, .3, 0], t: 0 });
  shadow(g, 1.6, { p: [0, .12, .3] });
  cyl(g, 1.5, 1.38, .14, C.STEEL, { p: [0, .2, .3] }); torus(g, 1.43, .075, C.STEEL_D, { p: [0, .28, .3], r: [PI / 2, 0, 0] });
  [[-.55, .25], [.2, -.4], [.6, .5]].forEach(([x, z]) => ball(g, .42, C.WHITE, { p: [x, .46, .3 + z], s: [1, .46, 1], t: .035 }));
  cyl(g, .34, .25, .3, C.STEEL, { p: [-.35, .44, -.5] }); cyl(g, .29, .29, .03, flat(0xE0732A), { p: [-.35, .6, -.5], t: 0 });
  cone(g, .6, 2.3, 0xEDBB62, { p: [1.95, 1.2, -1.0], r: [0, 0, -.08], seg: 28 }); shadow(g, .7, { p: [1.95, .012, -1.0] });
  cyl(g, .32, .26, .55, C.STEEL, { p: [-2.1, .28, -.7] }); cyl(g, .28, .28, .03, flat(0x7A4A22), { p: [-2.1, .56, -.7], t: 0 }); cyl(g, .5, .42, .2, C.STEEL, { p: [-2.1, .1, -.7] });
  [0, .33, .66].forEach(k => { puff(g, .1, .75, .3, k); puff(g, -2.1, .7, -.7, k + .17); }); }

/* 2 · paavam: the confident little sprout, with its screen */
{ const g = island(1, C.PURPLE);
  cyl(g, 1.25, 1.35, .22, C.NIGHT, { p: [-.2, .11, .3] }); shadow(g, .8, { p: [-.2, .23, .3] });
  const p = group(g, { p: [-.2, .22, .3] });
  [-1, 1].forEach(d => { cyl(p, .1, .1, .5, C.MINT, { p: [d * .22, .28, 0], t: .04 }); ball(p, .17, C.LEAF_D, { p: [d * .24, .06, .08], s: [1.2, .6, 1.5], t: .04 }); });
  ball(p, .52, C.MINT, { p: [0, .98, 0], s: [1, 1.15, .95] }); ball(p, .16, C.LEAF, { p: [0, .98, .46], s: [1, 1.3, .4], t: 0 });
  const head = group(p, { p: [0, 2.0, 0] });
  ball(head, .86, C.MINT, { s: [1.18, .9, 1] }); cyl(head, .05, .05, .34, C.LEAF_D, { p: [0, .88, 0], t: .03 });
  [-1, 1].forEach(d => { ball(head, .3, C.LEAF, { p: [d * .34, 1.08, 0], s: [1.35, .28, .75], r: [0, 0, d * .5], t: .04 }); box(head, .52, .3, .1, flat(C.INK), { p: [d * .37, .06, .8], r: [0, d * .22, 0], t: 0 }); ball(head, .13, flat(C.PINK), { p: [d * .66, -.2, .64], s: [1, .7, .3], t: 0 }); });
  box(head, .26, .08, .1, flat(C.INK), { p: [0, .12, .86], t: 0 }); torus(head, .16, .035, flat(C.INK), { p: [0, -.26, .82], r: [0, 0, PI], seg: 20 }).geometry = new THREE.TorusGeometry(.16, .035, 8, 20, PI);
  ball(p, .16, C.MINT, { p: [-.62, .95, .1], t: .04 });
  const arm = group(p, { p: [.52, 1.2, .1] }); ball(arm, .13, C.MINT, { p: [.14, .2, 0], s: [1, 2, 1], t: .04 }); ball(arm, .19, C.MINT, { p: [.26, .5, 0], t: .04 });
  live.push(t => { arm.rotation.z = -.5 + Math.sin(t * 5) * .28; head.rotation.z = Math.sin(t * 1.3) * .05; p.position.y = .22 + Math.abs(Math.sin(t * 2.2)) * .06; });
  const scr = print(256, 192, (x, w, h) => { x.fillStyle = '#1C1533'; x.fillRect(0, 0, w, h); x.fillStyle = '#72DDA4'; x.font = '800 30px "Baloo Thambi 2"'; x.fillText('இது ரொம்ப', 22, 70); x.fillText('ஈஸி!', 22, 112); x.fillStyle = '#F4B41A'; x.fillRect(22, 138, 150, 18); });
  const m = group(g, { p: [1.85, 0, -.7], r: [0, -.45, 0] }); box(m, 1.7, 1.25, .14, C.INK, { p: [0, 1.25, 0] }); panel(m, 1.5, 1.05, scr, { p: [0, 1.25, .08] }); cyl(m, .08, .08, .7, C.INK, { p: [0, .35, 0], t: .03 }); cyl(m, .5, .55, .1, C.INK, { p: [0, .05, 0], t: .03 }); }

/* 3 · the jukebox: a turntable, two speakers, notes in the air */
{ const g = island(2, C.MAG);
  box(g, 2.5, .36, 2.0, C.INK, { p: [0, .18, .3] });
  const rec = group(g, { p: [-.2, .4, .3] }); cyl(rec, 1.0, 1.0, .07, toon(0x221C18), { t: .03 }); cyl(rec, .38, .38, .08, C.TUR, { t: 0 }); cyl(rec, .05, .05, .16, C.STEEL, { t: 0 }); box(rec, .5, .09, .06, flat(C.CREAM), { p: [.62, .01, 0], t: 0 });
  live.push(t => { rec.rotation.y = -t * 2.2; });
  const arm = group(g, { p: [1.02, .52, -.45] }); cyl(arm, .1, .1, .22, C.STEEL, { t: .03 }); box(arm, .07, .07, 1.15, C.STEEL, { p: [-.24, .1, .52], r: [0, -.42, 0], t: .03 }); box(arm, .2, .12, .28, C.KUM, { p: [-.48, .06, 1.02], r: [0, -.42, 0], t: .03 });
  [-1, 1].forEach(d => { const s = group(g, { p: [d * 2.25, 0, -1.25], r: [0, -d * .35, 0] }); box(s, 1.0, 1.7, .85, C.INDIGO, { p: [0, .85, 0] }); cyl(s, .34, .34, .06, C.INK, { p: [0, 1.15, .44], r: [PI / 2, 0, 0], t: 0 }); cyl(s, .15, .15, .08, C.CREAM, { p: [0, 1.15, .46], r: [PI / 2, 0, 0], t: 0 }); cyl(s, .18, .18, .06, C.INK, { p: [0, .48, .44], r: [PI / 2, 0, 0], t: 0 });
    live.push(t => { s.scale.setScalar(1 + Math.max(0, Math.sin(t * 7.3 + d)) * .025); }); });
  [[-1.5, 2.3, -.2, C.CREAM, 0], [.2, 2.9, -.7, C.TUR, 1.3], [1.5, 2.2, .1, C.CREAM, 2.4]].forEach(([x, y, z, col, k]) => { const n = group(g, { p: [x, y, z] }); ball(n, .2, col, { s: [1.2, .85, 1], r: [0, 0, .4], t: .04 }); box(n, .06, .7, .06, col, { p: [.2, .36, 0], t: .035 }); box(n, .32, .14, .06, col, { p: [.34, .66, 0], r: [0, 0, -.35], t: .035 });
    live.push(t => { n.position.y = y + Math.sin(t * 1.6 + k) * .22; n.rotation.z = Math.sin(t * 1.1 + k) * .22; }); }); }

/* 4 · the library: a stack of books, one open on top */
{ const g = island(3, C.INDIGO); shadow(g, 1.7, { p: [0, .012, .2] });
  const book = (w, h, d, col, o) => { const b = group(g, o); box(b, w, h, d, col); box(b, w - .08, h - .12, d - .12, flat(C.PAPER), { p: [.07, 0, .07], t: 0 }); return b; };
  book(2.3, .4, 1.6, C.KUM, { p: [0, .2, .2], r: [0, .12, 0] }); book(2.0, .36, 1.45, C.TUR, { p: [-.05, .58, .2], r: [0, -.2, 0] }); book(1.8, .34, 1.3, C.LEAF, { p: [.05, .93, .2], r: [0, .3, 0] });
  const open = group(g, { p: [0, 1.14, .2], r: [0, .1, 0] }); [-1, 1].forEach(d => { box(open, .86, .07, 1.15, C.KUM_D, { p: [d * .42, .02, 0], r: [0, 0, d * .2], t: .035 }); box(open, .8, .09, 1.05, C.PAPER, { p: [d * .42, .08, 0], r: [0, 0, d * .2], t: .03 }); });
  box(open, .1, .03, 1.5, flat(C.KUM), { p: [.2, .2, .28], r: [0, 0, .2], t: 0 });
  book(.34, 1.7, 1.2, C.MAG, { p: [2.05, .85, -.5], r: [0, .3, -.16] }); book(.3, 1.4, 1.05, C.MINT, { p: [2.45, .7, -.2], r: [0, .3, -.3] });
  cyl(g, .22, .28, .5, C.KUM_D, { p: [-2.1, .25, -.5] }); [[-.06, C.TUR], [.08, C.LEAF], [0, C.PINK]].forEach(([x, c], k) => cyl(g, .04, .04, .7, c, { p: [-2.1 + x, .7, -.5 + (k - 1) * .08], r: [.12 * (k - 1), 0, x * 2], t: .025, seg: 8 }));
  live.push(t => { open.position.y = 1.14 + Math.sin(t * 1.2) * .03; }); }

/* 5 · boss level: the workbench, a laptop with rising bars, two gears turning */
{ const g = island(4, 0x2B241F); shadow(g, 2.0, { p: [0, .012, .1], a: .25 });
  box(g, 3.0, .16, 1.6, C.WOOD, { p: [0, 1.0, .1] }); [[-1.3, -.6], [1.3, -.6], [-1.3, .6], [1.3, .6]].forEach(([x, z]) => box(g, .14, .92, .14, C.WOOD, { p: [x, .46, .1 + z], t: .035 }));
  box(g, 1.3, .07, .86, C.STEEL, { p: [.1, 1.12, .25] });
  const scr = print(256, 170, (x, w, h) => { x.fillStyle = '#131017'; x.fillRect(0, 0, w, h); ['#D63A2F', '#F4B41A', '#43A35B', '#72DDA4', '#4A5FC1', '#C2398B'].forEach((c, k) => { const bh = 40 + (k * 37 % 80) + k * 6; x.fillStyle = c; x.fillRect(22 + k * 37, h - 22 - bh, 26, bh); }); x.fillStyle = '#fff'; x.fillRect(22, 18, 110, 9); });
  const lid = group(g, { p: [.1, 1.16, -.18], r: [-.22, 0, 0] }); box(lid, 1.3, .86, .06, C.INK, { p: [0, .43, 0] }); panel(lid, 1.16, .74, scr, { p: [0, .43, .04] });
  cyl(g, .16, .13, .28, C.KUM, { p: [1.1, 1.22, .45], t: .035 });
  const gear = (r, n, col, o, sp) => { const w = group(g, o); cyl(w, r, r, .2, col, { r: [PI / 2, 0, 0] }); for (let k = 0; k < n; k++) { const a = k * 2 * PI / n; box(w, r * .36, r * .36, .2, col, { p: [Math.cos(a) * r, Math.sin(a) * r, 0], r: [0, 0, a], t: .04 }); } cyl(w, r * .3, r * .3, .22, flat(C.INK), { r: [PI / 2, 0, 0], t: 0 }); live.push(t => { w.rotation.z = t * sp; }); };
  gear(.72, 9, C.TUR, { p: [-1.95, 1.95, -1.1] }, .9); gear(.48, 7, C.STEEL, { p: [-.9, 2.52, -1.1] }, -1.35);
  cyl(g, .07, .07, 1.6, C.INK, { p: [-1.95, .8, -1.1], t: .03 }); }

/* 6 · side quests: a flask that bubbles, an atom, a rack of test tubes */
{ const g = island(5, C.LEAF); shadow(g, .9, { p: [-.4, .012, .3] });
  const f = group(g, { p: [-.4, 0, .3] }); ball(f, .8, 0xF0A9D4, { p: [0, .78, 0], s: [1, .92, 1] }); ball(f, .7, flat(C.MAG), { p: [0, .62, .06], s: [1, .6, .96], t: 0 }); cyl(f, .24, .3, .8, 0xF7D3E8, { p: [0, 1.75, 0] }); torus(f, .26, .06, C.CREAM, { p: [0, 2.16, 0], r: [PI / 2, 0, 0] });
  [0, .3, .6, .85].forEach(k => { const b = ball(f, .09, flat(C.WHITE), { p: [0, 2.2, 0], t: 0, seg: 10 }); live.push(t => { const u = (t * .5 + k) % 1; b.position.set(Math.sin(u * 7 + k * 5) * .18, 2.2 + u * 1.5, 0); b.scale.setScalar(.6 + u); }); });
  const a = group(g, { p: [1.9, 1.75, -.6] }); ball(a, .3, C.KUM); [0, 1, 2].forEach(k => { const ring = group(a, { r: [PI / 2 + .3, k * PI / 3, 0] }); torus(ring, .95, .035, flat(C.INK)); const e = ball(ring, .12, C.TUR, { t: .035, seg: 12 }); live.push(t => { const q = t * (1.6 + k * .5) + k * 2; e.position.set(Math.cos(q) * .95, Math.sin(q) * .95, 0); }); });
  cyl(g, .06, .06, 1.5, C.INK, { p: [1.9, .75, -.6], t: .03 }); cyl(g, .45, .5, .12, C.INK, { p: [1.9, .06, -.6], t: .03 });
  box(g, 1.5, .16, .5, C.WOOD, { p: [-2.0, .5, -.9], r: [0, .3, 0] }); [[-.45, C.TUR], [0, C.SKY], [.45, C.KUM]].forEach(([x, c]) => cyl(g, .13, .13, 1.0, c, { p: [-2.0 + x * .95, .62, -.9 - x * .3], t: .035, seg: 16 })); }

/* 7 · the scrolls: an open scroll, a quill, an ink pot */
{ const g = island(6, C.CREAM); shadow(g, 1.8, { p: [0, .012, .1], a: .12 });
  const tx = print(256, 340, (x, w, h) => { x.fillStyle = '#FFFDF6'; x.fillRect(0, 0, w, h); x.fillStyle = '#1A1512'; x.font = '800 30px "Baloo 2"'; x.fillText('What if', 26, 56); x.fillStyle = '#D63A2F'; x.fillRect(26, 72, 130, 8); x.fillStyle = 'rgba(26,21,18,.55)'; for (let k = 0; k < 9; k++) x.fillRect(26, 104 + k * 24, k % 4 === 3 ? 120 : 204, 7); });
  const s = group(g, { p: [-.1, .55, .1], r: [-.42, .16, 0] }); box(s, 2.0, .05, 2.6, C.PAPER); panel(s, 1.8, 2.4, tx, { p: [0, .032, 0], r: [-PI / 2, 0, 0] });
  [-1, 1].forEach(d => { cyl(s, .2, .2, 2.3, C.PAPER, { p: [0, .12, d * 1.36], r: [0, 0, PI / 2] }); [-1, 1].forEach(e => cyl(s, .1, .1, .22, C.WOOD, { p: [e * 1.24, .12, d * 1.36], r: [0, 0, PI / 2], t: .03 })); });
  cyl(g, .34, .4, .46, C.INK, { p: [2.0, .23, .7] }); cyl(g, .26, .26, .03, flat(C.INDIGO), { p: [2.0, .47, .7], t: 0 });
  const q = group(g, { p: [2.0, .5, .7], r: [0, 0, -.42] }); cyl(q, .03, .02, .5, C.INK, { p: [0, .22, 0], t: .02, seg: 8 }); ball(q, .24, C.KUM, { p: [0, 1.15, 0], s: [.7, 3.2, .16], t: .04 }); live.push(t => { q.rotation.z = -.42 + Math.sin(t * 1.4) * .06; });
  ball(g, .5, C.PAPER, { p: [-2.1, .26, -.9], s: [1, .5, 1] }); cyl(g, .18, .18, 1.0, C.PAPER, { p: [-2.0, .3, .9], r: [PI / 2, 0, .5] }); }

/* 8 · player 2: the big red button under a gate */
{ const g = island(7, C.KUM);
  cyl(g, 1.65, 1.85, .5, C.INK, { p: [0, .25, .3] }); const b = cyl(g, 1.25, 1.25, .5, C.TUR, { p: [0, .72, .3] }); cyl(b, .9, .9, .06, flat(C.TUR2), { p: [0, .26, 0], t: 0 });
  live.push(t => { const u = Math.max(0, Math.sin(t * 2.4)); b.position.y = .72 - u * u * .14; });
  [-1, 1].forEach(d => { cyl(g, .2, .24, 2.9, C.CREAM, { p: [d * 2.4, 1.45, -1.3] }); ball(g, .3, C.TUR, { p: [d * 2.4, 3.05, -1.3], t: .045 }); });
  const sign = print(512, 96, (x, w, h) => { x.fillStyle = '#1A1512'; x.fillRect(0, 0, w, h); x.fillStyle = '#F4B41A'; x.font = '800 62px "Baloo 2"'; x.textAlign = 'center'; x.fillText(JOURNEY ? 'SAY HELLO' : 'PLAYER 2 · PRESS START', w / 2, 70, w - 30); });
  box(g, 5.2, .62, .3, C.INK, { p: [0, 2.62, -1.3] }); panel(g, 5.0, .5, sign, { p: [0, 2.62, -1.14] }); }

/* the dotted path between islands, clouds, far rocks */
for (let i = 0; i < POS.length - 1; i++) for (let k = 1; k < 8; k++) { const u = k / 8, p = POS[i].clone().lerp(POS[i + 1], u); if (Math.abs(u - .5) > .16) continue; ball(scene, .16, flat(C.CREAM), { p: [p.x, p.y - .2 + Math.sin(u * PI) * .5, p.z], t: .04, seg: 10 }); }
[[-9, 7.5, -20, 1.5], [14, 9, -24, 1.9], [33, 8, -22, 1.6], [52, 9.5, -25, 2.0], [70, 8, -21, 1.5], [24, -7, -12, 1.2], [61, -6.5, -11, 1.3], [84, 8.5, -22, 1.7]].forEach(([x, y, z, s], k) => { const c = group(scene, { p: [x, y, z], s }); [[0, 0, 0, 1], [.9, -.1, 0, .75], [-.9, -.12, 0, .7], [.35, .4, 0, .65]].forEach(([a, b, d, r]) => ball(c, r, flat(C.WHITE), { p: [a, b, d], s: [1, .78, .7], t: .045, seg: 16 })); live.push(t => { c.position.x = x + Math.sin(t * .12 + k) * 1.6; }); });

/* ---------- the owl ---------- */
const OS = BLEND ? .74 : .58, PERCH = new THREE.Vector3(BLEND ? 2.3 : -2.35, 1.74 * OS + .02, 1.55);
const START = new THREE.Vector3(POS[0].x + 17, 11, 10);                  // where the owl flies in from when the page opens
const sayEl = document.getElementById('owlsay'); let sayUntil = 0;
let sayAct = null; if (sayEl) sayEl.addEventListener('click', () => { const f = sayAct; if (f) { sayAct = null; sayUntil = 0; f(); } });
window.OWL = { say(text, ms = 4500, act) { if (!sayEl) return; sayAct = typeof act === 'function' ? act : null; sayEl.classList.toggle('tap', !!sayAct); sayEl.textContent = text; sayUntil = performance.now() + ms; sayEl.classList.add('on'); }, cheer() { cheerAt = performance.now() / 1000; }, no() { noAt = performance.now() / 1000; }, flip() { flipAt = performance.now() / 1000; }, sleep(v) { sleeping = !!v; }, dance(v) { dancing = !!v; } };
let noAt = -9, flipAt = -9, sleeping = false, dancing = false;
const O = makeOwl(scene, { s: OS });
/* the owl can turn golden, and wears the feathers it has won back as a fan behind it */
const GOLDEN = new Map([[C.INDIGO, 0xFFD75E], [C.INDIGO_D, 0xE6A91A]]), tinted = [];
O.owl.traverse(m => { if (m.isMesh && m.material && m.material.color && GOLDEN.has(m.material.color.getHex())) tinted.push([m.material, m.material.color.getHex()]); });
const FAN = []; { const g = group(O.body, { p: [0, -1.0, -.45], r: [-.12, 0, 0] });
  [0xF4B41A, 0x7FDBA6, 0xC2398B, 0x4A5FC1, 0x9DB2C6, 0x43A35B, 0xFFF6E3, 0xD63A2F].forEach((c, k) => { const piv = group(g, { r: [0, 0, -(k - 3.5) * .3] }); ball(piv, .5, c, { p: [0, 2.3, 0], s: [.5, 1.7, .1], t: .045, seg: 18 }); piv.visible = false; FAN.push({ piv, on: false, k: 0 }); }); }
window.OWL.wear = list => FAN.forEach((f, k) => { f.on = !!list[k]; });
window.OWL.gold = v => tinted.forEach(([mat, c]) => mat.color.setHex(v ? GOLDEN.get(c) : c));
const perchOf = i => POS[i].clone().add(PERCH);
O.owl.position.copy(perchOf(0));

/* ---------- state, camera, flight ---------- */
let cur = 0, from = BLEND && !reduce ? -1 : 0, flyT = BLEND && !reduce ? -.75 : 1, mapMode = false, intro = reduce ? 1 : 0;
const hits = scene.children.flatMap(o => o.children.filter(m => m.userData.i !== undefined));
const camPos = new THREE.Vector3(), camAim = new THREE.Vector3(), wantPos = new THREE.Vector3(), wantAim = new THREE.Vector3();
const mouse = { x: 0, y: 0, has: false };
function framing() {
  const a = cam.aspect, wide = clamp((a - .8) / .9);
  if (BLEND) {                                                            // the owl's island, big, in the part of the window the words leave free
    const ph = innerWidth <= 760, T = POS[mapMode ? 0 : cur], pitch = mapMode ? .3 : .4;
    const span = ph ? (mapMode ? .6 : .78) : mapMode ? lerp(.35, .4, wide) : lerp(.35, .37, wide), nx = ph ? (mapMode ? -.08 : 0) : mapMode ? lerp(.44, .46, wide) : lerp(.52, .56, wide), ny = ph ? (mapMode ? 1 - 440 / innerHeight : .44) : -.02;
    const hw = 7.4 / (2 * span), hh = hw / a, d = hh / Math.tan(cam.fov * PI / 360), sn = Math.sin(pitch), c = Math.cos(pitch);
    wantPos.set(T.x + .7 - nx * hw + mouse.x * .5, T.y + 1.3 + sn * d - ny * hh * c - mouse.y * .3, T.z + c * d + ny * hh * sn);
    wantAim.set(wantPos.x, wantPos.y - sn * d, wantPos.z - c * d); return; }
  if (JOURNEY && mapMode) { wantAim.set(lerp(14, 12, wide), lerp(5, -1, wide), -2); wantPos.set(lerp(4, -22, wide), lerp(15, 12, wide), lerp(44, 40, wide)); return; }
  if (JOURNEY) { const p = POS[cur], d = BLEND ? lerp(24, 20.5, wide) : lerp(24, 16.4, wide); wantAim.set(p.x - lerp(0, BLEND ? 7.4 : 4.6, wide), p.y + lerp(-3.4, .8, wide), p.z); wantPos.set(wantAim.x + mouse.x * .7, p.y + d * .42 - mouse.y * .4, p.z + d * .92); return; }
  if (mapMode) { const span = POS[POS.length - 1].x, d = Math.max(60, (span + 16) / (2 * Math.tan(17 * PI / 180) * a)); wantAim.set(span / 2, -.5, 0); wantPos.set(span / 2, d * .42, d * .92); return; }
  const p = POS[cur], d = lerp(21, 15.2, wide);
  wantAim.set(p.x - lerp(0, 2.4, wide), p.y + lerp(2.6, 1.0, wide), p.z);
  wantPos.set(wantAim.x + mouse.x * .9, p.y + d * .42 - mouse.y * .5, p.z + d * .92);
}
function go(i) {
  i = clamp(i, 0, WORLDS.length - 1); if (i === cur && !mapMode) return;
  if (mapMode) { mapMode = false; if (!JOURNEY) $('#mapTxt').textContent = 'Whole map'; }
  if (i !== cur) { from = cur; cur = i; flyT = 0; }
  paintInfo();
}
function paintInfo() {
  document.querySelectorAll('.wl').forEach((l, k) => l.classList.toggle('on', k === cur));
  if (JOURNEY) return;
  const w = WORLDS[cur], info = $('#info'); info.classList.add('swap');
  setTimeout(() => {
    $('#iNo').textContent = cur === 7 ? 'Final level' : `World ${cur + 1} of 8`; $('#iFact').textContent = w.fact;
    const h = $('#iName'); h.textContent = w.name; h.classList.toggle('ta', /[஀-௿]/.test(w.name)); $('#iEn').textContent = w.en; $('#iLine').textContent = w.line;
    $('#iGo').href = 'index.html#' + w.id; info.classList.remove('swap');
  }, 140);
  document.querySelectorAll('#dots i').forEach((d, k) => d.classList.toggle('on', k === cur));
  document.querySelectorAll('.wl').forEach((l, k) => l.classList.toggle('on', k === cur));
}

/* labels pinned above the islands */
const labels = WORLDS.map((w, i) => { const l = document.createElement('div'); l.className = 'wl'; l.innerHTML = `<b>${w.n}</b><span>${JOURNEY ? PLAIN[i] : w.name}</span>`; $('#labels').appendChild(l); return l; });
if (!JOURNEY) {
$('#dots').innerHTML = WORLDS.map(() => '<i></i>').join('');
document.querySelectorAll('#dots i').forEach((d, k) => d.addEventListener('click', () => go(k)));
$('#prev').addEventListener('click', () => go(cur - 1)); $('#next').addEventListener('click', () => go(cur + 1));
$('#map').addEventListener('click', () => { mapMode = !mapMode; $('#mapTxt').textContent = mapMode ? 'Back to the owl' : 'Whole map'; });
addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(cur + 1); else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(cur - 1); else if (e.key === 'Enter') location.href = $('#iGo').href; else if (e.key.toLowerCase() === 'm') $('#map').click(); });
let wheelAt = 0; addEventListener('wheel', e => { const now = performance.now(); if (now - wheelAt < 520 || Math.abs(e.deltaY) + Math.abs(e.deltaX) < 12) return; wheelAt = now; go(cur + ((Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) > 0 ? 1 : -1)); }, { passive: true });
}
const ray = new THREE.Raycaster(), v2 = new THREE.Vector2(); let downAt = null;
const owlHit = e => { const r = renderer.domElement.getBoundingClientRect(); v2.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(v2, cam); return ray.intersectObject(O.owl, true).length > 0; };
const pick = e => { const r = renderer.domElement.getBoundingClientRect(); v2.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(v2, cam); const h = ray.intersectObjects(hits)[0]; return h ? h.object.userData.i : -1; };
/* a journey has no controls: the stop nearest the middle of the window decides where the owl is */
const stops = JOURNEY ? [...document.querySelectorAll('[data-stop]')] : [], seen = new Set(); let cheerAt = -9;
let lastBest = -2;
function follow() {
  const mid = innerHeight * .5; let best = 0, bd = 1e9;
  stops.forEach((el, k) => { const r = el.getBoundingClientRect(), d = r.top <= mid && r.bottom > mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid)); if (d < bd) { bd = d; best = k; } });
  stops.forEach((el, k) => el.classList.toggle('here', k === best));
  if (best !== lastBest) { lastBest = best; document.dispatchEvent(new CustomEvent('hp:stop', { detail: { i: best - 1 } })); }
  if (best === 0) { if (BLEND && cur !== 0) go(0); mapMode = true; } else { const was = cur; if (mapMode || best - 1 !== cur) go(best - 1); seen.add(best - 1); if (best - 1 === 7 && was !== 7) cheerAt = performance.now() / 1000 + 1.2; }
  document.querySelectorAll('#prog i').forEach((d, k) => { d.classList.toggle('on', best > 0 && k === best - 1); d.classList.toggle('seen', seen.has(k)); });
}
if (JOURNEY) { mapMode = true; addEventListener('scroll', follow, { passive: true }); addEventListener('resize', follow); document.querySelectorAll('#prog i').forEach((d, k) => d.addEventListener('click', () => stops[k + 1].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: BLEND ? 'start' : 'center' }))); }
renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', e => { if (!downAt) return; const dx = e.clientX - downAt[0], dy = e.clientY - downAt[1]; downAt = null;
  if (JOURNEY && Math.hypot(dx, dy) < 8 && owlHit(e)) { cheerAt = performance.now() / 1000; document.dispatchEvent(new CustomEvent('hp:owl')); return; }
  if (JOURNEY) { const i = Math.hypot(dx, dy) < 8 ? pick(e) : -1; if (i >= 0) stops[i + 1].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: BLEND ? 'start' : 'center' }); return; }
  if (Math.abs(dx) > 60) return go(cur + (dx < 0 ? 1 : -1)); const i = pick(e); if (i >= 0) go(i); });
addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1; mouse.has = e.pointerType !== 'touch'; renderer.domElement.style.cursor = (JOURNEY && owlHit(e)) || pick(e) >= 0 ? 'pointer' : ''; }, { passive: true });

/* ---------- the loop ---------- */
const v3 = new THREE.Vector3(); let last = performance.now();
framing(); camPos.copy(wantPos); camAim.copy(wantAim);
if (!reduce) { camPos.set(POS[7].x / 2, 30, 78); camAim.set(POS[7].x / 2, 0, 0); }
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(.05, (now - last) / 1000), t = now / 1000; last = now;
  for (const f of live) f(t);
  intro = Math.min(1, intro + dt / 2.2);
  framing(); const k = 1 - Math.exp(-dt * (intro < 1 ? 1.5 : 3.4));
  camPos.lerp(wantPos, k); camAim.lerp(wantAim, k); cam.position.copy(camPos); cam.lookAt(camAim);

  /* the owl: perched, or flying an arc to the next island */
  const a = from < 0 ? START : perchOf(from), b = perchOf(cur); let flying = false, dir = 0;
  if (flyT < 1) { flyT = Math.min(1, flyT + dt / (reduce ? .01 : 1.25)); const u = ease.io(clamp(flyT)); O.owl.position.lerpVectors(a, b, u); O.owl.position.y += Math.sin(u * PI) * (2.4 + Math.abs(cur - from) * .4); flying = flyT < 1; if (!flying && from < 0) { from = 0; cheerAt = t + .1; } dir = Math.sign(b.x - a.x) * Math.sin(u * PI); }
  else { O.owl.position.copy(b); O.owl.position.y += Math.sin(t * .8 + cur * 1.7) * .14; }
  O.owl.rotation.y += ((flying ? dir * 1.15 : (BLEND ? -.3 : .32)) - O.owl.rotation.y) * (1 - Math.exp(-dt * 9)); O.owl.rotation.z = flying ? -dir * .2 : 0;
  v3.copy(O.owl.position).project(cam);
  FAN.forEach(f => { f.k += ((f.on ? 1 : 0) - f.k) * (1 - Math.exp(-dt * 6)); f.piv.visible = f.k > .02; f.piv.scale.setScalar(Math.max(.001, f.k)); });
  { const su = (t - flipAt) / .8; if (su >= 0 && su < 1) { O.owl.position.y += Math.sin(su * PI) * 1.3; O.owl.rotation.x = -su * PI * 2; } else O.owl.rotation.x = 0; }
  O.tick(dt, t, { no: t - noAt < .9, sleep: sleeping && !flying, dance: dancing && !flying, flying, cheer: t > cheerAt && t - cheerAt < 1.3 ? 1 : 0, look: mouse.has && !flying ? [clamp((mouse.x - v3.x) * 1.6, -1, 1), clamp((mouse.y + v3.y) * 1.6, -1, 1)] : [Math.sin(t * .6) * .5, Math.sin(t * .43) * .25] });
  if (sayEl) { if (now > sayUntil) sayEl.classList.remove('on'); else { const hx = (v3.x * .5 + .5) * innerWidth; v3.copy(O.owl.position); v3.y += 1.25; v3.project(cam); const hy = (-v3.y * .5 + .5) * innerHeight, bw = sayEl.offsetWidth, bh = sayEl.offsetHeight;
    const bx = clamp(hx - bw * .5, 10, innerWidth - bw - (innerWidth > 760 ? 64 : 44)); sayEl.style.transform = `translate3d(${bx.toFixed(1)}px,${clamp(hy - bh - 16, 78, innerHeight - bh - 10).toFixed(1)}px,0)`; sayEl.style.setProperty('--tail', clamp(hx - bx, 22, bw - 22).toFixed(0) + 'px'); } }

  /* labels */
  const w = innerWidth, h = innerHeight;
  labels.forEach((l, i) => { v3.set(POS[i].x, POS[i].y + (mapMode ? 4.6 : 4.1), POS[i].z).project(cam); const x = (v3.x * .5 + .5) * w, y = (-v3.y * .5 + .5) * h, vis = v3.z < 1 && x > -80 && x < w + 80 && y > 70 && y < h - 20;
    l.style.opacity = vis && (!JOURNEY || mapMode) ? (i === cur || mapMode ? 1 : .86) : 0; l.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%) scale(${i === cur && !mapMode ? 1.12 : .92})`; });
  renderer.render(scene, cam);
}
paintInfo(); if (JOURNEY) follow();
document.fonts.ready.then(() => requestAnimationFrame(frame));
