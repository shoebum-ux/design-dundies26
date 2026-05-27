import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cards } from '../data/cards'
import { asset } from '../asset'

const CARD_BACK = asset('assets/card-back.png')

export default function Ending({ onShuffle }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.4 })
  const n = cards.length
  const spread = 64 // total fan angle in degrees

  return (
    <section
      ref={ref}
      className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-24"
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0B3C5D 0%, #1E90C6 55%, #FFB36B 100%)',
        }}
      />

      {/* Confetti rain */}
      {inView &&
        Array.from({ length: 60 }).map((_, i) => {
          const colors = ['#FFD23F', '#FF6B6B', '#1E90C6', '#5FD9A6', '#FF7EB3', '#fff']
          const left = (i * 53) % 100
          const dur = 2.5 + (i % 5)
          return (
            <motion.span
              key={i}
              className="absolute top-[-5%]"
              style={{
                left: `${left}%`,
                width: 8,
                height: 14,
                borderRadius: 2,
                background: colors[i % colors.length],
              }}
              initial={{ y: '-10%', rotate: 0, opacity: 0 }}
              animate={{ y: '110vh', rotate: 720, opacity: [0, 1, 1, 0.7] }}
              transition={{ duration: dur, repeat: Infinity, delay: (i % 12) * 0.25, ease: 'linear' }}
            />
          )
        })}

      <div className="relative z-10 flex flex-col items-center">
        {/* Fan of cards */}
        <div className="relative mb-12 h-[clamp(220px,38vh,360px)] w-full max-w-3xl">
          {cards.map((card, i) => {
            const t = n > 1 ? i / (n - 1) : 0.5
            const angle = -spread / 2 + t * spread
            const x = (t - 0.5) * 620
            const y = Math.abs(t - 0.5) * 160
            return (
              <motion.div
                key={card.id}
                className="absolute left-1/2 top-1/2"
                style={{ zIndex: i }}
                initial={{ x: -20, y: 220, rotate: 0, opacity: 0, scale: 0.6 }}
                animate={
                  inView
                    ? { x, y, rotate: angle, opacity: 1, scale: 1 }
                    : { x: -20, y: 220, rotate: 0, opacity: 0, scale: 0.6 }
                }
                transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: y - 40, scale: 1.08, zIndex: 50 }}
              >
                <div className="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl shadow-soft ring-1 ring-white/40">
                  <img
                    src={card.img || CARD_BACK}
                    alt={`${card.name} — ${card.title}`}
                    className="h-[clamp(150px,24vh,230px)] w-auto object-cover"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="headline text-center text-6xl text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.4)] md:text-8xl"
        >
          Every Day Wins.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-3 text-lg font-semibold text-white/85 md:text-xl"
        >
          Legendary humans, all summer long. ☀
        </motion.p>

        <motion.button
          onClick={onShuffle}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1 }}
          whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(255,210,63,0.8)' }}
          whileTap={{ scale: 0.95 }}
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-sun px-9 py-4 text-lg font-extrabold uppercase tracking-wide text-deep shadow-glow ring-2 ring-white/70"
        >
          <span aria-hidden>↻</span> Shuffle Again
        </motion.button>
      </div>
    </section>
  )
}
