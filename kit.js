/* hariprav.in look proofs · the shared toon kit: flat comic shading, ink outlines of even thickness, the owl, the worlds. */
import * as THREE from 'three';
export { THREE };

export const C = { INK: 0x1A1512, INDIGO: 0x4A5FC1, INDIGO_D: 0x3447A6, CREAM: 0xFFF6E3, PAPER: 0xFFFDF6, TUR: 0xF4B41A, TUR2: 0xF8C749, KUM: 0xD63A2F, KUM_D: 0xB92B21,
  LEAF: 0x43A35B, LEAF_D: 0x2F7C43, MAG: 0xC2398B, MINT: 0x72DDA4, NIGHT: 0x1C1533, PURPLE: 0x3A2E6B, WHITE: 0xffffff, STEEL: 0xD5DBE1, STEEL_D: 0xAEB7C0, WOOD: 0x9A6638, ROCK: 0x5E4630, PINK: 0xF29BC4, SKY: 0x9FB0F2 };
export const hex = n => '#' + n.toString(16).padStart(6, '0');

const YEARS = new Date().getFullYear() - 2000;
export const WORLDS = [
  { id: 'w1', n: '1', name: '#டிபன்சைக்காலஜி', en: 'Tiffin Psychology', line: "Sixteen breakfast plates, each with one of life's secrets hiding on it.", fact: '8 of 16 plates out', color: C.TUR, img: 'assets/tiffin-cover.jpg' },
  { id: 'w2', n: '2', name: 'பாவம் AI', en: 'Paavam AI', line: 'The most confident AI in the world meets everyday questions it cannot answer.', fact: 'New series · 2 episodes', color: C.MINT, img: 'assets/paavam-cover.jpg' },
  { id: 'w3', n: '3', name: 'The Jukebox', en: 'Original Tamil songs', line: 'I write the words first. Songs that ask why, songs of love, friendship and festivals.', fact: 'Latest: ஏன், ஏன், ஏன்...', color: C.MAG, img: 'assets/thumbs/kU-EvOG246k.jpg' },
  { id: 'w4', n: '4', name: 'The Library', en: 'Books', line: 'AI எனும் நான் is on the shelf. Three more books are locked for now.', fact: '1 unlocked · 3 in the making', color: C.INDIGO, img: 'assets/book-cover.jpg' },
  { id: 'w5', n: '5', name: 'Boss level', en: 'The day job', line: YEARS + ' years of turning ideas into products that ship, from IKEA to MapSDG.', fact: 'In the game since 2000', color: C.TUR2, img: 'assets/mapsdg-dashboard.png' },
  { id: 'w6', n: '6', name: 'Side quests', en: 'Labs', line: 'Interactive explainers that take one big idea and make it fun to explore.', fact: '4 mini games', color: C.LEAF, img: '' },
  { id: 'w7', n: '7', name: 'The Scrolls', en: 'Essays on Medium', line: 'Long reads on AI and philosophy, written between builds.', fact: 'Latest: July 2026', color: C.CREAM, img: 'assets/medium/m1.jpg' },
  { id: 'p2', n: '★', name: 'Player 2', en: 'Co-op mode', line: 'Book a hands-on consultation, a group training or a talk. Or just say hello.', fact: 'Press start', color: C.KUM, img: '' },
];

/* ---------- materials ---------- */
const ramp = new THREE.DataTexture(new Uint8Array([150, 215, 255]), 3, 1, THREE.RedFormat);
ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true;
export const toon = (c, o = {}) => new THREE.MeshToonMaterial({ color: c, gradientMap: ramp, ...o });
export const flat = (c, o = {}) => new THREE.MeshBasicMaterial({ color: c, ...o });
const inkBack = new THREE.MeshBasicMaterial({ color: C.INK, side: THREE.BackSide });
const asMat = m => (typeof m === 'number' ? toon(m) : m);

function place(m, { p = [0, 0, 0], s = [1, 1, 1], r = [0, 0, 0] } = {}) { m.position.set(...p); m.scale.set(...(typeof s === 'number' ? [s, s, s] : s)); m.rotation.set(...r); return m; }
function outlined(parent, geo, mat, o, grow) {
  const m = place(new THREE.Mesh(geo, asMat(mat)), o), t = o.t ?? .05;
  if (t) { const k = new THREE.Mesh(geo, inkBack), sc = m.scale; k.scale.set(...grow(t, sc)); m.add(k); }
  parent.add(m); return m;
}
/* each maker gives the outline the same thickness t (world units) on every axis */
export const ball = (parent, r, mat, o = {}) => outlined(parent, new THREE.SphereGeometry(r, o.seg || 32, o.seg ? Math.round(o.seg * .7) : 22), mat, o, (t, s) => [1 + t / (r * s.x), 1 + t / (r * s.y), 1 + t / (r * s.z)]);
export const box = (parent, w, h, d, mat, o = {}) => outlined(parent, new THREE.BoxGeometry(w, h, d), mat, o, (t, s) => [1 + 2 * t / (w * s.x), 1 + 2 * t / (h * s.y), 1 + 2 * t / (d * s.z)]);
export const cyl = (parent, rt, rb, h, mat, o = {}) => outlined(parent, new THREE.CylinderGeometry(rt, rb, h, o.seg || 36), mat, o, (t, s) => { const r = Math.max(rt, rb, .001); return [1 + t / (r * s.x), 1 + 2 * t / (h * s.y), 1 + t / (r * s.z)]; });
export const cone = (parent, r, h, mat, o = {}) => outlined(parent, new THREE.ConeGeometry(r, h, o.seg || 24), mat, o, (t, s) => [1 + 1.6 * t / (r * s.x), 1 + 2.4 * t / (h * s.y), 1 + 1.6 * t / (r * s.z)]);
export const torus = (parent, r, tube, mat, o = {}) => { const m = place(new THREE.Mesh(new THREE.TorusGeometry(r, tube, 12, o.seg || 44), asMat(mat)), o); parent.add(m); return m; };
export const group = (parent, o = {}) => { const g = place(new THREE.Group(), o); parent.add(g); return g; };
export const shadow = (parent, r, o = {}) => { const m = place(new THREE.Mesh(new THREE.CircleGeometry(r, 28), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: o.a ?? .16, depthWrite: false })), { p: o.p || [0, .012, 0], r: [-Math.PI / 2, 0, 0], s: o.s || 1 }); parent.add(m); return m; };

/* a print on a flat panel: draw with canvas 2D, get a texture */
export function print(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData.canvas = c; t.userData.ctx = g; return t; }
export const panel = (parent, w, h, tex, o = {}) => { const m = place(new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: !!o.alpha, toneMapped: false })), o); parent.add(m); return m; };

export function stage(canvas, { fov = 35 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, .1, 400);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8b7fd0, 1.55));
  const sun = new THREE.DirectionalLight(0xffffff, 2.0); sun.position.set(-6, 10, 8); scene.add(sun);
  const fit = () => { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  fit(); addEventListener('resize', fit);
  return { renderer, scene, cam, sun, fit };
}

/* ---------- the owl ---------- */
export function makeOwl(parent, o = {}) {
  const owl = group(parent, o), body = group(owl);
  ball(body, 1, C.INDIGO, { p: [0, -.6, 0], s: [1, 1.06, .92] });
  ball(body, .62, C.CREAM, { p: [0, -.78, .56], s: [1, 1, .52], t: .04 });
  [[-.17, -.62], [.17, -.62], [0, -.84]].forEach(([x, y]) => [-1, 1].forEach(d => box(body, .17, .05, .04, flat(C.INDIGO), { p: [x + d * .055, y, .93 - Math.abs(x) * .12], r: [0, 0, d * -.62], t: 0 })));
  [-1, 1].forEach(d => ball(body, .2, C.TUR, { p: [d * .34, -1.66, .36], s: [1.25, .5, 1.45], t: .045 }));
  const wings = [-1, 1].map(d => { const piv = group(body, { p: [d * .9, -.2, -.05] }); ball(piv, .5, C.INDIGO_D, { p: [d * .08, -.52, 0], s: [.4, 1.22, .86] }); return piv; });
  const head = group(body, { p: [0, .58, .04] });
  ball(head, 1, C.INDIGO, { s: [1.06, .9, .96] });
  [-1, 1].forEach(d => cone(head, .24, .66, C.INDIGO, { p: [d * .64, .74, 0], r: [0, 0, d * -.5], seg: 16 }));
  [-1, 1].forEach(d => ball(head, .52, C.CREAM, { p: [d * .43, -.02, .66], s: [1, 1, .4], t: 0 }));
  const eyes = [-1, 1].map(d => { const g = group(head, { p: [d * .43, 0, .9] });
    const white = ball(g, .33, flat(C.WHITE), { s: [1, 1, .35], t: 0 }); torus(g, .355, .052, flat(C.INK), { p: [0, 0, .08] });
    const pupil = ball(g, .15, flat(C.INK), { p: [0, 0, .12], s: [1, 1, .4], t: 0 }); ball(pupil, .05, flat(C.WHITE), { p: [-.05, .06, .12], t: 0 }); return { white, pupil }; });
  cyl(head, .04, .04, .16, flat(C.INK), { p: [0, .03, .98], r: [0, 0, Math.PI / 2], t: 0, seg: 8 });
  cone(head, .17, .36, C.TUR, { p: [0, -.3, .95], r: [2.05, Math.PI / 4, 0], seg: 4, t: .04 });

  let blinkAt = 1.5 + Math.random() * 2, blinkEnd = 0, yaw = 0, pitch = 0, flap = 0, lean = 0;
  /* st: { look: [-1..1, -1..1], flying, cheer (0..1) } */
  function tick(dt, t, st = {}) {
    const [nx, ny] = st.look || [0, 0], e = 1 - Math.exp(-dt * 9);
    yaw += (nx * .5 - yaw) * e; pitch += (ny * .32 - pitch) * e;
    head.rotation.set(pitch + (st.sleep ? .3 : 0), yaw + (st.no ? Math.sin(t * 15) * .42 : 0), Math.sin(t * 1.1) * .03 + (st.sleep ? .12 : 0));
    eyes.forEach(q => { q.pupil.position.x = nx * .11; q.pupil.position.y = -ny * .09; });
    if (t > blinkAt) { blinkEnd = t + .13; blinkAt = t + 3.4 + Math.random() * 3.2; }
    const lid = t < blinkEnd || st.sleep ? .08 : 1; eyes.forEach(q => { q.white.scale.y = lid; q.pupil.scale.y = lid; });
    flap += ((st.flying || st.cheer ? 1 : 0) - flap) * (1 - Math.exp(-dt * 10)); lean += ((st.flying ? .3 : 0) - lean) * e;
    const beat = Math.sin(t * (st.cheer ? 26 : 21));
    wings.forEach((w, i) => { const d = i ? 1 : -1; w.rotation.z = d * (.1 + flap * (.95 + beat * .75)) + Math.sin(t * 1.6 + i) * .02; });
    body.rotation.x = lean; body.scale.y = 1 + Math.sin(t * 2.2) * .012;
    body.rotation.z = st.dance ? Math.sin(t * 6.2) * .14 : 0; body.position.y = st.dance ? Math.abs(Math.sin(t * 6.2)) * .14 : 0;
  }
  return { owl, body, head, tick };
}

export const ease = { io: u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, o: u => 1 - Math.pow(1 - u, 3), back: u => { const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); } };
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, u) => a + (b - a) * u;
