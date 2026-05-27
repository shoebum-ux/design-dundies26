import { motion } from 'framer-motion'

// Deterministic pseudo-random so layouts are stable across renders.
const rng = (seed) => {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function Confetti({ color, accent, glow }) {
  const pieces = Array.from({ length: 28 })
  const colors = [color, accent, glow, '#fff']
  return (
    <>
      {pieces.map((_, i) => {
        const left = rng(i + 1) * 100
        const delay = rng(i + 7) * 0.4
        const rot = rng(i + 3) * 360
        const dur = 1.4 + rng(i + 5) * 1.2
        return (
          <motion.span
            key={i}
            className="absolute top-[-8%] block"
            style={{
              left: `${left}%`,
              width: 8,
              height: 12,
              borderRadius: 2,
              background: colors[i % colors.length],
            }}
            initial={{ y: '-10%', opacity: 0, rotate: rot }}
            animate={{ y: '120%', opacity: [0, 1, 1, 0], rotate: rot + 360 }}
            transition={{ duration: dur, delay, ease: 'easeIn' }}
          />
        )
      })}
    </>
  )
}

// Renders the personality-specific burst the moment a card lands face-up.
export default function RevealEffect({ effect, theme }) {
  const { primary, accent, glow } = theme
  const common = 'pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]'

  switch (effect) {
    case 'golden-burst':
      return (
        <div className={common}>
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 origin-bottom"
              style={{
                width: 3,
                height: '60%',
                background: `linear-gradient(${glow}, transparent)`,
                rotate: `${(i / 16) * 360}deg`,
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: [0, 1, 0.6], opacity: [0, 0.9, 0] }}
              transition={{ duration: 1.1, delay: i * 0.02 }}
            />
          ))}
          <Confetti color={primary} accent={accent} glow={glow} />
        </div>
      )

    case 'shimmer-wave':
      return (
        <div className={common}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-x-0 h-1/3"
              style={{ background: `linear-gradient(90deg, transparent, ${glow}, transparent)` }}
              initial={{ y: '-40%', opacity: 0 }}
              animate={{ y: '140%', opacity: [0, 0.7, 0] }}
              transition={{ duration: 1.3, delay: i * 0.25 }}
            />
          ))}
        </div>
      )

    case 'island-particles':
      return (
        <div className={common}>
          {Array.from({ length: 22 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${rng(i + 2) * 100}%`,
                bottom: '-6%',
                width: 5 + rng(i) * 7,
                height: 5 + rng(i) * 7,
                background: i % 2 ? primary : glow,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: '-130%', opacity: [0, 1, 0] }}
              transition={{ duration: 1.8 + rng(i) * 1, delay: rng(i + 4) * 0.5 }}
            />
          ))}
        </div>
      )

    case 'ocean-ripple':
      return (
        <div className={`${common} grid place-items-center`}>
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="absolute rounded-full border-2"
              style={{ borderColor: glow }}
              initial={{ width: 20, height: 20, opacity: 0.8 }}
              animate={{ width: 500, height: 500, opacity: 0 }}
              transition={{ duration: 1.8, delay: i * 0.3, ease: 'easeOut' }}
            />
          ))}
        </div>
      )

    case 'speed-streaks':
      return (
        <div className={common}>
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-[3px]"
              style={{
                top: `${rng(i) * 100}%`,
                width: '60%',
                background: `linear-gradient(90deg, transparent, ${accent})`,
              }}
              initial={{ x: '-80%', opacity: 0 }}
              animate={{ x: '160%', opacity: [0, 1, 0] }}
              transition={{ duration: 0.7, delay: rng(i) * 0.4 }}
            />
          ))}
          <Confetti color={primary} accent={accent} glow={glow} />
        </div>
      )

    case 'rescue-flare':
      return (
        <div className={`${common} grid place-items-center`}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{ background: `radial-gradient(circle, ${primary}cc, transparent 70%)` }}
              initial={{ width: 60, height: 60, opacity: 0.9 }}
              animate={{ width: 420, height: 420, opacity: 0 }}
              transition={{ duration: 1.3, delay: i * 0.35, repeat: 1 }}
            />
          ))}
        </div>
      )

    case 'sunrise':
      return (
        <div className={common}>
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{
              bottom: '-30%',
              width: '120%',
              height: '120%',
              background: `radial-gradient(circle at 50% 100%, ${glow}, ${primary}88 35%, transparent 60%)`,
            }}
            initial={{ y: '40%', opacity: 0 }}
            animate={{ y: '0%', opacity: [0, 0.9, 0.5] }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          />
        </div>
      )

    case 'underwater-rays':
      return (
        <div className={common}>
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute top-[-10%] origin-top"
              style={{
                left: `${10 + i * 13}%`,
                width: 28,
                height: '130%',
                rotate: '12deg',
                background: `linear-gradient(${glow}88, transparent)`,
              }}
              initial={{ opacity: 0, scaleY: 0.6 }}
              animate={{ opacity: [0, 0.6, 0.2], scaleY: 1 }}
              transition={{ duration: 1.6, delay: i * 0.08 }}
            />
          ))}
        </div>
      )

    case 'juicy-splash':
      return (
        <div className={`${common} grid place-items-center`}>
          {Array.from({ length: 18 }).map((_, i) => {
            const a = (i / 18) * Math.PI * 2
            return (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{ width: 10, height: 10, background: i % 2 ? primary : accent }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(a) * 160,
                  y: Math.sin(a) * 160,
                  opacity: [1, 1, 0],
                  scale: [1, 0.6],
                }}
                transition={{ duration: 1.1, delay: 0.1 }}
              />
            )
          })}
        </div>
      )

    case 'juice-bubbles':
      return (
        <div className={common}>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full border"
              style={{
                left: `${rng(i + 1) * 100}%`,
                bottom: '-6%',
                width: 8 + rng(i) * 16,
                height: 8 + rng(i) * 16,
                background: `${primary}66`,
                borderColor: `${glow}`,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: '-140%', opacity: [0, 1, 0], x: [0, rng(i + 3) * 20 - 10] }}
              transition={{ duration: 2 + rng(i) * 1.2, delay: rng(i) * 0.6 }}
            />
          ))}
        </div>
      )

    case 'liquid-swirl':
      return (
        <div className={`${common} grid place-items-center`}>
          {[primary, accent, glow].map((c, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-xl"
              style={{ width: 160, height: 160, background: c, opacity: 0.5 }}
              initial={{ rotate: 0, x: 0 }}
              animate={{ rotate: 360, x: [0, 40 * (i - 1), 0], y: [0, -30 * i, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>
      )

    case 'friendship-glow':
      return (
        <div className={`${common} grid place-items-center`}>
          <motion.div
            className="absolute rounded-full blur-2xl"
            style={{ width: '90%', height: '90%', background: `radial-gradient(circle, ${glow}, transparent 65%)` }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.1, 0.95], opacity: [0, 0.85, 0.5] }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
          <Confetti color={primary} accent={accent} glow={glow} />
        </div>
      )

    default:
      return null
  }
}
