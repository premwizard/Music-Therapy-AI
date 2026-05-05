import { useState, useEffect } from 'react'

export default function WaveformVisualizer() {
  const [bars, setBars] = useState(Array(40).fill(0))

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prevBars => 
        prevBars.map(() => Math.random() * 100)
      )
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-forest-950/90 border-2 border-mint shadow-mint-glow">
      <div className="absolute inset-0 flex items-center justify-center gap-1 p-4">
        {bars.map((height, index) => (
          <div
            key={index}
            className="flex-1 bg-gradient-to-t from-mint-500 to-mint-400 rounded-full transition-all duration-200 ease-out shadow-mint-glow"
            style={{ 
              height: `${height}%`,
              opacity: 0.8 + (height / 500),
              boxShadow: `0 0 ${height / 10}px rgba(46, 204, 138, 0.5)`
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}
