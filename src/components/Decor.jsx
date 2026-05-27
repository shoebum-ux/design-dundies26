// Hand-built SVG motifs for the summer theme. Each is a self-contained, scalable icon.

export function PalmLeaf({ className = '', style }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} fill="none">
      <g stroke="#2E7D32" strokeWidth="3" strokeLinecap="round">
        <path d="M60 115 C58 80 58 50 60 18" stroke="#5D4037" strokeWidth="5" />
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = -90 + (i - 2.5) * 32
        const rad = (a * Math.PI) / 180
        const ex = 60 + Math.cos(rad) * 52
        const ey = 22 + Math.sin(rad) * 52
        const cx = 60 + Math.cos(rad) * 24 - Math.sin(rad) * 14
        const cy = 22 + Math.sin(rad) * 24 + Math.cos(rad) * 14
        return (
          <path
            key={i}
            d={`M60 22 Q ${cx} ${cy} ${ex} ${ey} Q ${cx + 6} ${cy + 6} 60 22 Z`}
            fill={i % 2 ? '#43A047' : '#66BB6A'}
            stroke="#2E7D32"
            strokeWidth="1.5"
          />
        )
      })}
    </svg>
  )
}

export function Flamingo({ className = '', style }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} fill="none">
      <ellipse cx="60" cy="92" rx="46" ry="20" fill="#FF8FB1" />
      <ellipse cx="60" cy="92" rx="26" ry="11" fill="#FFD7E5" />
      <path
        d="M44 80 C40 55 52 48 64 50 C78 52 76 36 66 34 C58 32 54 38 56 44"
        stroke="#FF6E9C"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="58" cy="33" r="7" fill="#FF6E9C" />
      <path d="M52 33 L42 35 L52 39 Z" fill="#FFB300" />
      <circle cx="60" cy="31" r="1.6" fill="#0B3C5D" />
    </svg>
  )
}

export function Sunglasses({ className = '', style }) {
  return (
    <svg viewBox="0 0 140 70" className={className} style={style} fill="none">
      <rect x="6" y="14" width="52" height="40" rx="14" fill="#0B3C5D" />
      <rect x="82" y="14" width="52" height="40" rx="14" fill="#0B3C5D" />
      <rect x="12" y="20" width="40" height="20" rx="9" fill="#FF6B6B" opacity="0.8" />
      <rect x="88" y="20" width="40" height="20" rx="9" fill="#FF6B6B" opacity="0.8" />
      <path d="M58 24 Q70 16 82 24" stroke="#0B3C5D" strokeWidth="7" strokeLinecap="round" />
    </svg>
  )
}

export function BeachBall({ className = '', style }) {
  const colors = ['#FFD23F', '#FF6B6B', '#1E90C6', '#5FD9A6', '#FF9E2C', '#FF7EB3']
  return (
    <svg viewBox="0 0 100 100" className={className} style={style}>
      <circle cx="50" cy="50" r="46" fill="#fff" />
      {colors.map((c, i) => {
        const a0 = (i * 60 * Math.PI) / 180
        const a1 = ((i + 1) * 60 * Math.PI) / 180
        return (
          <path
            key={i}
            d={`M50 50 L ${50 + 46 * Math.cos(a0)} ${50 + 46 * Math.sin(a0)} A46 46 0 0 1 ${
              50 + 46 * Math.cos(a1)
            } ${50 + 46 * Math.sin(a1)} Z`}
            fill={c}
          />
        )
      })}
      <circle cx="50" cy="50" r="8" fill="#fff" />
      <circle cx="38" cy="34" r="12" fill="#fff" opacity="0.5" />
    </svg>
  )
}

export function Sparkle({ className = '', style, color = '#FFF1B8' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} fill="none">
      <path
        d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z"
        fill={color}
      />
    </svg>
  )
}

export function Wave({ className = '', style, color = '#1E90C6' }) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={className} style={style}>
      <path
        fill={color}
        d="M0 60 C 180 110 360 10 540 50 C 720 90 900 0 1080 40 C 1260 80 1380 30 1440 50 L1440 120 L0 120 Z"
      />
    </svg>
  )
}

export function PalmTree({ className = '', style }) {
  return (
    <svg viewBox="0 0 200 240" className={className} style={style} fill="none">
      <path d="M96 230 C92 160 92 110 100 70" stroke="#6D4C2E" strokeWidth="12" strokeLinecap="round" />
      <path d="M96 230 C100 160 104 120 100 70" stroke="#8B5E3C" strokeWidth="7" strokeLinecap="round" />
      {[-70, -35, 0, 40, 75].map((deg, i) => {
        const rad = ((deg - 90) * Math.PI) / 180
        const ex = 100 + Math.cos(rad) * 80
        const ey = 66 + Math.sin(rad) * 70
        return (
          <path
            key={i}
            d={`M100 66 Q ${100 + Math.cos(rad) * 36} ${66 + Math.sin(rad) * 32} ${ex} ${ey} Q ${
              100 + Math.cos(rad) * 50
            } ${66 + Math.sin(rad) * 50} 100 66 Z`}
            fill={i % 2 ? '#3F9142' : '#52B254'}
          />
        )
      })}
      <circle cx="100" cy="66" r="9" fill="#8B5E3C" />
    </svg>
  )
}
