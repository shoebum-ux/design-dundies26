import { useEffect, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Hero from './components/Hero'
import WinnerCard from './components/WinnerCard'
import Ending from './components/Ending'
import FloatingElements from './components/FloatingElements'
import { cards } from './data/cards'
import { playReveal, preloadSounds } from './sound'

// When the card swaps to its face in WinnerCard — the drum-roll crests here and
// the applause + cheers kick in right as the winner is revealed.
const FLIP_SECONDS = 1.2

export default function App() {
  const cardsRef = useRef(null)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 })

  // Decode the reveal samples up front so the very first card reveal already has
  // the real drum-roll, applause and cheers ready (audio resumes on first click).
  useEffect(() => {
    preloadSounds()
  }, [])

  // Interaction sound layer. 'reveal' fires a drum-roll + applause on card flip.
  const playSound = (type) => {
    if (type === 'reveal') playReveal(FLIP_SECONDS)
    // Extension hook for any future custom sounds.
    if (typeof window !== 'undefined' && window.__dundieSound) window.__dundieSound(type)
  }

  const scrollToCards = () => {
    cardsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative grain bg-deep">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed left-0 top-0 z-[60] h-1.5 origin-left bg-gradient-to-r from-sun via-coral to-ocean"
        style={{ scaleX: progress, width: '100%' }}
      />

      <FloatingElements opacity={0.55} />

      <Hero onReveal={scrollToCards} />

      <div ref={cardsRef} className="relative z-10">
        {cards.map((card, i) => (
          <WinnerCard
            key={card.id}
            card={card}
            index={i}
            total={cards.length}
            onHoverSound={() => playSound('hover')}
            onRevealSound={() => playSound('reveal')}
          />
        ))}
      </div>

      <Ending />

      <footer className="relative z-10 bg-deep py-8 text-center text-sm font-semibold text-white/50">
        Design Dundies · Summer Edition · Fun awards. Big appreciation. All good vibes.
      </footer>
    </div>
  )
}
