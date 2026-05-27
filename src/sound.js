// Web Audio sound design for the card reveal.
// A synthesized snare drum-roll builds tension during the flip, then a REAL
// recorded crowd-applause sample celebrates the reveal as the card lands.
// (Sample: Google Sound Library "battle_crowd_celebration", CC-BY 4.0.)
// If the sample can't be decoded (e.g. older Safari + Ogg/Opus), we fall back
// to a synthesized applause so something always plays.

import { asset } from './asset'

const APPLAUSE_URL = asset('assets/sounds/applause.ogg')

let ctx = null
let master = null
let applauseBuffer = null
let applauseLoad = null // pending decode promise

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.5
    master.connect(ctx.destination)
  }
  // Browsers start the context suspended until a user gesture (our click).
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Fetch + decode the applause sample once, cached for replays.
function loadApplause(audio) {
  if (applauseBuffer || applauseLoad) return applauseLoad
  applauseLoad = fetch(APPLAUSE_URL)
    .then((r) => r.arrayBuffer())
    .then((data) => audio.decodeAudioData(data))
    .then((buf) => {
      applauseBuffer = buf
      return buf
    })
    .catch(() => null) // decode unsupported → fall back to synth applause
  return applauseLoad
}

// Warm the sample as soon as possible so it's ready on the first reveal.
export function preloadSounds() {
  const audio = getCtx()
  if (audio) loadApplause(audio)
}

function noiseBuffer(audio, seconds) {
  const len = Math.max(1, Math.floor(audio.sampleRate * seconds))
  const buf = audio.createBuffer(1, len, audio.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return buf
}

// One short, snappy noise transient (a snare tap / a clap).
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

// Accelerating, crescendoing snare roll over `duration` seconds.
function drumroll(audio, startAt, duration) {
  let t = 0
  while (t < duration) {
    const p = t / duration
    tap(audio, startAt + t, {
      gain: 0.1 + p * 0.22,
      freq: 1600 + Math.random() * 600,
      q: 0.6,
      decay: 0.05,
    })
    // interval tightens from ~70ms to ~26ms as the roll builds
    t += 0.07 - p * 0.044
  }
  // accent hit that punctuates the reveal
  tap(audio, startAt + duration, { gain: 0.5, freq: 1400, q: 0.5, decay: 0.18 })
}

// Fallback synthesized applause: many randomly-timed claps with a swell envelope.
// Only used if the recorded sample fails to load/decode.
function synthApplause(audio, startAt, duration) {
  const count = 110
  for (let i = 0; i < count; i++) {
    const t = Math.random() * duration
    const swell = Math.sin(Math.min(t / duration, 1) * Math.PI) // 0 → 1 → 0
    tap(audio, startAt + t, {
      gain: (0.04 + Math.random() * 0.1) * (0.35 + 0.65 * swell),
      freq: 1100 + Math.random() * 1800,
      q: 0.5,
      decay: 0.03 + Math.random() * 0.03,
    })
  }
}

// Play the recorded applause sample with a short fade-out tail.
function playApplauseSample(audio, startAt, buffer) {
  const src = audio.createBufferSource()
  src.buffer = buffer
  const g = audio.createGain()
  const dur = Math.min(buffer.duration, 3.2)
  g.gain.setValueAtTime(0.0001, startAt)
  g.gain.linearRampToValueAtTime(0.95, startAt + 0.08) // quick swell in
  g.gain.setValueAtTime(0.95, startAt + dur - 0.7)
  g.gain.exponentialRampToValueAtTime(0.0001, startAt + dur) // fade tail
  src.connect(g)
  g.connect(master)
  src.start(startAt)
  src.stop(startAt + dur)
}

// Public: drum-roll under the flip, real applause as the card lands.
// `flipSeconds` should match the moment the card shows its face.
export function playReveal(flipSeconds = 1.0) {
  const audio = getCtx()
  if (!audio) return
  const now = audio.currentTime + 0.02
  drumroll(audio, now, flipSeconds)

  const applauseAt = now + flipSeconds
  if (applauseBuffer) {
    playApplauseSample(audio, applauseAt, applauseBuffer)
  } else {
    // Try to load; if ready in time use the sample, otherwise synth fallback.
    loadApplause(audio)
    let used = false
    if (applauseLoad) {
      applauseLoad.then((buf) => {
        if (buf && !used) {
          used = true
          // schedule relative to the live clock (decode may finish late)
          playApplauseSample(audio, Math.max(audio.currentTime + 0.01, applauseAt), buf)
        }
      })
    }
    // Safety net: if the sample isn't ready ~by reveal time, play synth.
    setTimeout(() => {
      if (!applauseBuffer && !used) {
        used = true
        synthApplause(audio, audio.currentTime + 0.01, 1.9)
      }
    }, Math.max(0, flipSeconds * 1000))
  }
}
