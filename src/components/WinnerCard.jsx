import { useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import RevealEffect from './RevealEffect'
import { asset } from '../asset'

const CARD_BACK = asset('assets/card-back.png')

export default function WinnerCard({ card, index, total, onHoverSound, onRevealSound }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.45 })
  const [revealed, setRevealed] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Pointer-driven 3D tilt (only meaningful once revealed).
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 15 })

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const handleLeave = () => {
    mx.set(0)
    my.set(0)
    setHovered(false)
  }

  const reveal = () => {
    if (revealed) return
    setRevealed(true)
    onRevealSound?.()
  }

  const { theme } = card

  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-20">
      {/* Ambient color wash — brightens once revealed */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${theme.glow}33, transparent 60%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? (revealed ? 1 : 0.25) : 0 }}
        transition={{ duration: 1 }}
      />

      <div ref={ref} className="relative z-10 flex flex-col items-center gap-6">
        {/* Refined kicker — category name + tagline are always visible (even face-down) */}
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: -24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span
            className="rounded-full px-4 py-1 text-xs font-extrabold uppercase tracking-[0.4em] text-deep"
            style={{ background: theme.glow }}
          >
            Card {String(index + 1).padStart(2, '0')} / {total}
          </span>
          <h2 className="headline mt-3 text-4xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] md:text-5xl">
            {card.title}
          </h2>
          <p
            className="mt-1 text-sm font-bold uppercase tracking-[0.3em]"
            style={{ color: theme.glow }}
          >
            {card.tagline}
          </p>
        </motion.div>

        {/* Flip stage */}
        <motion.div
          className="relative"
          style={{ perspective: 2600 }}
          initial={{ opacity: 0, scale: 0.85, y: 60 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            role={revealed ? undefined : 'button'}
            tabIndex={revealed ? -1 : 0}
            aria-label={revealed ? undefined : `Reveal card ${index + 1} of ${total}`}
            className={`relative h-[clamp(340px,54vh,500px)] w-[clamp(244px,38.7vh,358px)] outline-none ${
              revealed ? '' : 'cursor-pointer'
            }`}
            style={{ transformStyle: 'preserve-3d', rotateX: rotX, rotateY: rotY }}
            onClick={reveal}
            onKeyDown={(e) => {
              if (!revealed && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                reveal()
              }
            }}
            onMouseEnter={() => {
              setHovered(true)
              onHoverSound?.()
            }}
            onMouseMove={revealed ? handleMove : undefined}
            onMouseLeave={handleLeave}
          >
            {/* Squish flipper: card narrows to an edge, swaps face, widens back.
                A pure horizontal scale (no Y-rotation) — so there is NO center-axis
                fold and therefore no half-tint at any point in the animation. */}
            <motion.div
              className="absolute inset-0"
              style={{ transformOrigin: 'center' }}
              animate={{
                scaleX: revealed ? [1, 0.04, 1] : 1,
                filter: revealed
                  ? ['brightness(1)', 'brightness(0.82)', 'brightness(1)']
                  : 'brightness(1)',
              }}
              transition={{ duration: 0.62, delay: revealed ? 0.55 : 0, times: [0, 0.5, 1], ease: 'easeInOut' }}
            >
              {/* BACK — hidden the instant the card is edge-on */}
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-[22px] shadow-soft ring-1 ring-white/20"
                animate={{ opacity: revealed ? 0 : 1 }}
                transition={{ duration: 0.001, delay: revealed ? 0.86 : 0 }}
              >
                <img src={CARD_BACK} alt="" className="h-full w-full object-cover" />
              </motion.div>

              {/* FRONT — revealed the instant the card is edge-on */}
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-[22px] shadow-soft ring-1 ring-white/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: revealed ? 1 : 0 }}
                transition={{ duration: 0.001, delay: revealed ? 0.86 : 0 }}
              >
                <img
                  src={card.img}
                  alt={`${card.name} — ${card.title}`}
                  className="h-full w-full object-cover"
                />

                {/* Glossy highlight — soft, STATIC corner sheen. Fades in after the flip. */}
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-[22px]"
                  style={{
                    background:
                      'radial-gradient(120% 80% at 18% 0%, rgba(255,255,255,0.35), rgba(255,255,255,0) 45%)',
                    mixBlendMode: 'soft-light',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: revealed ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: revealed ? 1.2 : 0 }}
                />

                {/* Reveal burst fires right as the front lands */}
                {revealed && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [1, 1, 0] }}
                    transition={{ duration: 2.4, delay: 0.9, times: [0, 0.7, 1] }}
                  >
                    <RevealEffect effect={card.effect} theme={theme} />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Glow halo */}
            <motion.div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] blur-2xl"
              style={{ background: theme.glow }}
              animate={{ opacity: revealed ? (hovered ? 0.7 : 0.4) : 0.18 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        </motion.div>

        {/* "Tap to reveal" prompt — visible until the card is flipped */}
        <motion.div
          className="pointer-events-none flex h-6 items-center gap-2 text-sm font-bold uppercase tracking-[0.3em] text-white/85"
          animate={{ opacity: inView && !revealed ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.span
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            ✦
          </motion.span>
          Tap to reveal
        </motion.div>
      </div>
    </div>
  )
}
