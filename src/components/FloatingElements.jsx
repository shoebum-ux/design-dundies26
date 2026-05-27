import { motion } from 'framer-motion'
import { BeachBall, Flamingo, PalmLeaf, Sparkle, Sunglasses } from './Decor'

// Each entry: a motif drifting/bobbing at its own pace. Positioned with vw/vh so it
// scales across the whole page behind the scrolling content.
const items = [
  { C: PalmLeaf, x: '4%', y: '12%', s: 130, dur: 9, delay: 0, rot: -12 },
  { C: Flamingo, x: '82%', y: '18%', s: 150, dur: 11, delay: 1.5, rot: 8 },
  { C: Sunglasses, x: '12%', y: '68%', s: 120, dur: 8, delay: 0.6, rot: -6 },
  { C: BeachBall, x: '88%', y: '72%', s: 90, dur: 7, delay: 1, rot: 0 },
  { C: Sparkle, x: '50%', y: '8%', s: 46, dur: 5, delay: 0.2, rot: 0 },
  { C: Sparkle, x: '24%', y: '40%', s: 32, dur: 6, delay: 1.2, rot: 0 },
  { C: Sparkle, x: '74%', y: '52%', s: 38, dur: 5.5, delay: 0.8, rot: 0 },
  { C: PalmLeaf, x: '92%', y: '44%', s: 90, dur: 10, delay: 2, rot: 20 },
]

export default function FloatingElements({ opacity = 0.6 }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ opacity }}>
      {items.map(({ C, x, y, s, dur, delay, rot }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: x, top: y, width: s, height: s }}
          initial={{ y: 0, rotate: rot }}
          animate={{ y: [0, -22, 0], rotate: [rot, rot + 6, rot] }}
          transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <C className="h-full w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)]" />
        </motion.div>
      ))}
    </div>
  )
}
