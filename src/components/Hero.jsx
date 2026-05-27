import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Sparkle } from './Decor'
import { asset } from '../asset'

export default function Hero({ onReveal }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Parallax: box & text drift up and fade as you scroll past the hero.
  const boxY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative grid min-h-screen place-items-center overflow-hidden">
      {/* Animated sunset gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #2A6FB0 0%, #4FA3D1 28%, #FFB36B 62%, #FF8C69 80%, #FFD98A 100%)',
        }}
        animate={{ filter: ['hue-rotate(0deg)', 'hue-rotate(-8deg)', 'hue-rotate(0deg)'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Moving light rays */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-[-20%] origin-top"
            style={{
              width: 120,
              height: '140%',
              rotate: `${(i - 4) * 11}deg`,
              background:
                'linear-gradient(to bottom, rgba(255,245,200,0.45), rgba(255,245,200,0))',
              filter: 'blur(8px)',
            }}
            animate={{ opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}
      </div>

      {/* Sun glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 700,
          height: 700,
          background: 'radial-gradient(circle, rgba(255,235,170,0.85), transparent 60%)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating particles */}
      {Array.from({ length: 30 }).map((_, i) => {
        const left = (i * 37) % 100
        const size = 2 + (i % 4)
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${left}%`, bottom: '-5%', width: size, height: size, opacity: 0.7 }}
            animate={{ y: [0, -800], opacity: [0, 0.8, 0] }}
            transition={{
              duration: 10 + (i % 6),
              repeat: Infinity,
              delay: (i % 10) * 0.8,
              ease: 'linear',
            }}
          />
        )
      })}

      {/* Centerpiece: rotating 3D box */}
      <motion.div className="relative z-10 flex flex-col items-center px-6" style={{ y: boxY, opacity: fade }}>
        <div style={{ perspective: 1600 }}>
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotateY: -40 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: [-18, 18, -18], rotateZ: [-1.5, 1.5, -1.5], y: [0, -16, 0] }}
              transition={{
                rotateY: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                rotateZ: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <img
                src={asset('assets/box.png')}
                alt="Design Dundies Summer Edition box"
                className="w-[clamp(260px,42vw,520px)] drop-shadow-[0_40px_60px_rgba(11,60,93,0.5)]"
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.div style={{ y: textY }} className="mt-2 max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-lg font-semibold leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] md:text-2xl"
          >
            Celebrating the legendary humans behind the work, the vibes, and the wins.
          </motion.p>

          <motion.button
            onClick={onReveal}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(255,210,63,0.8)' }}
            whileTap={{ scale: 0.96 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-coral px-9 py-4 text-lg font-extrabold uppercase tracking-wide text-white shadow-glow ring-2 ring-white/60"
          >
            Reveal the Winners
            <span aria-hidden>→</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/90"
        style={{ opacity: fade }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <Sparkle className="mx-auto mb-1 h-6 w-6" color="#fff" />
        <span className="text-xs font-bold uppercase tracking-[0.3em]">Scroll</span>
      </motion.div>
    </section>
  )
}
