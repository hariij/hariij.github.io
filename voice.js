/* hariprav.in · "Hari says": Hari's own voice (his ElevenLabs clone) as a personal touch.
   A line plays only after something the visitor did, one at a time, and never when sound is off.
   Every line also shows as words beside his face, so nobody needs sound to get it.
   The clip for a line is assets/voice/<id>.mp3. A line without a clip yet still shows its words.

   Slots: welcome (tap his photo) · kudos (a feather is won; picked at random, no repeats until all have played)
          friend1..friend4 (a step up with the owl: Visitor, Friend, Good friend, Best friend) · gold (the golden feather)
   Fit: a kudos marked firstTry praises attention, so it plays only when the answer was right the first time, without a hint.
        No kudos on the eighth feather (the golden thank-you follows). The golden thank-you plays once a visit.
        A big line never cuts another off: it waits for the one before it to finish.
   Every line opens in Tamil and may carry on in English. A line that is all Tamil has `en`: its meaning, shown under it to read.
   The words are Hari's, or drafted for him and approved by him. Change lines here only with his say. */
(() => {
'use strict';
const LINES = [
  { id: 'welcome-1', slot: 'welcome', text: 'வாங்க, இன்னும் பழகுவோம்!', en: 'Come, let us get to know each other better.' },
  { id: 'kudos-1', slot: 'kudos', text: 'சூப்பர்! You got that one right.' },
  { id: 'kudos-2', slot: 'kudos', firstTry: true, text: 'செம்ம! You are really paying attention.' },
  { id: 'kudos-3', slot: 'kudos', firstTry: true, text: 'சரியா சொன்னீங்க! Not many people notice that.' },
  { id: 'kudos-4', slot: 'kudos', text: 'அதே தான்! Now you know me a little better.' },
  { id: 'kudos-5', slot: 'kudos', text: 'அருமை! Keep going, there is more to see.' },
  { id: 'friend-1', slot: 'friend1', text: 'வாங்க வாங்க! Take your time and look around.' },
  { id: 'friend-2', slot: 'friend2', text: 'நாம இப்போ friends! Thank you for staying.' },
  { id: 'gold-1', slot: 'gold', text: 'You found everything. நன்றி. This really means a lot to me.' },
  { id: 'friend-3', slot: 'friend3', text: 'ஒரு சில பேர் தான் உங்கள மாதிரி என்னைப் புரிஞ்சுக்குவாங்க.', en: 'Only a few people understand me the way you do.' },
  { id: 'friend-4', slot: 'friend4', text: 'என்னைப் பத்தி இவ்ளோ புரிஞ்சுக்கிட்டவங்க உங்கள மாதிரி யாரும் இல்ல.', en: 'Nobody has understood this much about me the way you have.' },
];
const box = document.createElement('div'); box.id = 'harisays'; box.setAttribute('role', 'status');
box.innerHTML = '<img src="assets/portrait.jpg" alt=""><span><small>Hari says</small><b></b><em></em></span><i class="hs-wave" aria-hidden="true"><i></i><i></i><i></i></i>';
document.body.appendChild(box); document.body.classList.add('hasvoice');
const words = box.querySelector('b'), meaning = box.querySelector('em'); let audio = null, hideT = 0, busyUntil = 0, speaking = false, queued = null, goldSaid = false; const played = {};

function say(slot, ctx = {}) {
  let pool = LINES.filter(l => l.slot === slot); if (slot === 'kudos' && !ctx.first) pool = pool.filter(l => !l.firstTry);
  if (!pool.length) return false;
  if (slot === 'gold') { if (goldSaid) return false; goldSaid = true; }
  if (slot !== 'kudos' && speaking) { queued = [slot, ctx]; return true; }    // let the line being spoken finish first
  if (slot === 'kudos' && Date.now() < busyUntil) return false;             // a bigger moment is being spoken: do not talk over it
  if (slot !== 'kudos') busyUntil = Date.now() + 6000;
  let fresh = pool.filter(l => !played[l.id]); if (!fresh.length) { pool.forEach(l => { delete played[l.id]; }); fresh = pool; }
  const line = fresh[Math.floor(Math.random() * fresh.length)]; played[line.id] = 1;
  words.textContent = line.text; meaning.textContent = line.en || ''; meaning.hidden = !line.en; box.classList.add('on'); box.classList.remove('speaking');
  clearTimeout(hideT); hideT = setTimeout(() => box.classList.remove('on'), 6500);
  if (audio) { audio.pause(); audio = null; speaking = false; }
  if (window.HP && window.HP.sound && !window.HP.sound()) return true;        // sound is off: the words alone
  const a = new Audio('assets/voice/' + line.id + '.mp3'); audio = a;
  const done = () => { if (audio !== a) return; speaking = false; if (queued) { const q = queued; queued = null; if (q[0] === 'gold') goldSaid = false; setTimeout(() => say(q[0], q[1]), 450); } };
  a.addEventListener('playing', () => { if (audio !== a) return; speaking = true; box.classList.add('speaking'); clearTimeout(hideT); });
  a.addEventListener('error', done); a.addEventListener('pause', done);
  a.addEventListener('ended', () => { if (audio !== a) return; done(); box.classList.remove('speaking'); hideT = setTimeout(() => box.classList.remove('on'), 1800); });
  a.play().catch(() => {});                                                  // no clip yet, or the browser said no: the words are already showing
  return true;
}
window.HARI = { say, lines: LINES };

const photo = document.querySelector('.me');
if (photo) { photo.setAttribute('role', 'button'); photo.tabIndex = 0; photo.title = 'Hear from Hari'; const go = () => say('welcome'); photo.addEventListener('click', go); photo.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); }
document.addEventListener('hp:feather', e => { const d = e.detail || {}; if (d.n >= 8) return; setTimeout(() => say('kudos', { first: !!d.first }), 900); });
document.addEventListener('hp:friend', e => setTimeout(() => say('friend' + e.detail.level), 600));
document.addEventListener('hp:gold', () => setTimeout(() => say('gold'), 700));
})();
