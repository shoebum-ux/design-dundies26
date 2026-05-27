// Web Audio sound design for the card reveal.
// Real recorded samples (Mixkit, free license; WAV plays in every browser):
//   • drumroll — a snare roll builds tension during the flip
//   • applause — hand-clapping crowd erupts as the card lands
//   • cheer    — hooting / whooping layered on top of the applause
// Synthesized fallbacks cover the drumroll/applause if a sample can't decode.

import { asset } from './asset'

const URLS = {
  drumroll: asset('assets/sounds/drumroll.wav'),
  applause: asset('assets/sounds/applause.wav'),
  cheer: asset('assets/sounds/cheer.wav'),
}

let ctx = null
let master = null
const buffers = {} // name -> AudioBuffer
const loads = {} // name -> pending decode promise

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.55
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Fetch + decode a sample once, cached for replays.
function loadSample(audio, name) {
  if (buffers[name]) return Promise.resolve(buffers[name])
  if (loads[name]) return loads[name]
  loads[name] = fetch(URLS[name])
    .then((r) => r.arrayBuffer())
    .then((d) => audio.decodeAudioData(d))
    .then((b) => {
      buffers[name] = b
      return b
    })
    .catch(() => null)
  return loads[name]
}

// Decode all samples up front so the first reveal already has them.
export function preloadSounds() {
  const audio = getCtx()
  if (!audio) return
  Object.keys(URLS).forEach((n) => loadSample(audio, n))
}

// Generic one-shot sample player with fade in/out.
function playBuffer(audio, buf, when, { gain = 0.85, offset = 0, dur, fadeIn = 0.04, fadeOut = 0.5 } = {}) {
  const src = audio.createBufferSource()
  src.buffer = buf
  const g = audio.createGain()
  const length = dur != null ? dur : Math.max(0.1, buf.duration - offset)
  g.gain.setValueAtTime(0.0001, when)
  g.gain.linearRampToValueAtTime(gain, when + fadeIn)
  g.gain.setValueAtTime(gain, Math.max(when + fadeIn, when + length - fadeOut))
  g.gain.exponentialRampToValueAtTime(0.0001, when + length)
  src.connect(g)
  g.connect(master)
  src.start(when, offset)
  src.stop(when + length + 0.05)
}

// Real drum-roll: play a steady mid-section of the roll with a crescendo,
// then duck out as the applause hits.
function playDrumrollSample(audio, when, dur, buf) {
  const src = audio.createBufferSource()
  src.buffer = buf
  const g = audio.createGain()
  g.gain.setValueAtTime(0.22, when)
  g.gain.linearRampToValueAtTime(0.6, when + dur * 0.92) // build tension
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur + 0.12) // duck under applause
  src.connect(g)
  g.connect(master)
  src.start(when, 1.0) // skip any soft intro — start inside the roll
  src.stop(when + dur + 0.18)
}

// ---- Synthesized fallbacks (only if a sample fails to decode) ----
function noiseBuffer(audio, seconds) {
  const len = Math.max(1, Math.floor(audio.sampleRate * seconds))
  const buf = audio.createBuffer(1, len, audio.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return buf
}
function tap(audio, time, { gain = 0.25, freq = 1800, q = 0.7, decay = 0.06 } = {}) {
  const src = audio.createBufferSource()
  src.buffer = noiseBuffer(audio, decay + 0.02)
  const bp = audio.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = freq
  bp.Q.value = q
  const g = audio.createGain()
  g.gain.setValueAtTime(Math.max(0.0001, gain), time)
  g.gain.exponentialRampToValueAtTime(0.0001, time + decay)
  src.connect(bp)
  bp.connect(g)
  g.connect(master)
  src.start(time)
  src.stop(time + decay + 0.02)
}
function synthDrumroll(audio, startAt, duration) {
  let t = 0
  while (t < duration) {
    const p = t / duration
    tap(audio, startAt + t, { gain: 0.1 + p * 0.22, freq: 1600 + Math.random() * 600, q: 0.6, decay: 0.05 })
    t += 0.07 - p * 0.044
  }
  tap(audio, startAt + duration, { gain: 0.5, freq: 1400, q: 0.5, decay: 0.18 })
}
function synthApplause(audio, startAt, duration) {
  for (let i = 0; i < 110; i++) {
    const t = Math.random() * duration
    const swell = Math.sin(Math.min(t / duration, 1) * Math.PI)
    tap(audio, startAt + t, {
      gain: (0.04 + Math.random() * 0.1) * (0.35 + 0.65 * swell),
      freq: 1100 + Math.random() * 1800,
      q: 0.5,
      decay: 0.03 + Math.random() * 0.03,
    })
  }
}

// Public: drum-roll under the flip, then applause + cheers as the card lands.
// `flipSeconds` is when the card shows its face (the drum-roll crests here).
export function playReveal(flipSeconds = 1.2) {
  const audio = getCtx()
  if (!audio) return
  const now = audio.currentTime + 0.02
  const revealAt = now + flipSeconds

  // Drum-roll during the suspense
  if (buffers.drumroll) {
    playDrumrollSample(audio, now, flipSeconds, buffers.drumroll)
  } else {
    loadSample(audio, 'drumroll')
    synthDrumroll(audio, now, flipSeconds)
  }

  // Applause (clapping) on reveal
  if (buffers.applause) {
    playBuffer(audio, buffers.applause, revealAt, {
      gain: 0.9,
      dur: Math.min(buffers.applause.duration, 4.5),
      fadeOut: 0.7,
    })
  } else {
    loadSample(audio, 'applause')
    synthApplause(audio, revealAt, 1.9)
  }

  // Cheering / hooting layered on top (no fallback — it's an extra layer)
  if (buffers.cheer) {
    playBuffer(audio, buffers.cheer, revealAt + 0.04, {
      gain: 0.72,
      dur: Math.min(buffers.cheer.duration, 4.5),
      fadeOut: 0.8,
    })
  } else {
    loadSample(audio, 'cheer')
  }
}
