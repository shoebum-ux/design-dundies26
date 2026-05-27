import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { cards } from '../data/cards'
import { asset } from '../asset'

const CARD_BACK = asset('assets/card-back.png')
const SPREAD = 64 // total fan angle in degrees

// Fisher–Yates shuffle returning a new array (guaranteed reordered).
function shuffled(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  // Avoid the (rare) identical order so a shuffle always looks like one.
  if (a.every((c, i) => c.id === list[i].id) && a.length > 1) {
    ;[a[0], a[1]] = [a[1], a[0]]
  }
  return a
}

export default function Ending() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.4 })
  const [order, setOrder] = useState(cards)
  const [dealing, setDealing] = useState(false) // true while collapsed mid-shuffle
  const n = order.length

  const shuffle = () => {
    if (dealing) return
    setDealing(true) // gather into a stack
    setTimeout(() => {
      setOrder((prev) => shuffled(prev)) // re-deal in a new order
      setDealing(false)
    }, 300)
  }

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
          {order.map((card, i) => {
            const t = n > 1 ? i / (n - 1) : 0.5
            const angle = -SPREAD / 2 + t * SPREAD
            const x = (t - 0.5) * 620
            const y = Math.abs(t - 0.5) * 160

            // Three states: hidden (not in view), gathered (mid-shuffle), fanned.
            const target = !inView
              ? { x: -20, y: 220, rotate: 0, opacity: 0, scale: 0.6 }
              : dealing
                ? { x: 0, y: 0, rotate: (i - n / 2) * 0.8, opacity: 1, scale: 0.92 }
                : { x, y, rotate: angle, opacity: 1, scale: 1 }

            const transition = dealing
              ? { duration: 0.32, ease: 'easeIn' } // snap into the stack together
              : { duration: 0.7, delay: inView ? i * 0.05 : 0, ease: [0.22, 1, 0.36, 1] } // deal out

            return (
              <motion.div
                key={card.id}
                className="absolute left-1/2 top-1/2"
                style={{ zIndex: i }}
                animate={target}
                transition={transition}
                whileHover={!dealing ? { y: y - 40, scale: 1.08, zIndex: 50 } : undefined}
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
          onClick={shuffle}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1 }}
          whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(255,210,63,0.8)' }}
          whileTap={{ scale: 0.95 }}
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-sun px-9 py-4 text-lg font-extrabold uppercase tracking-wide text-deep shadow-glow ring-2 ring-white/70"
        >
          <motion.span aria-hidden animate={dealing ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.4 }}>
            ↻
          </motion.span>{' '}
          Shuffle Again
        </motion.button>
      </div>
    </section>
  )
}
