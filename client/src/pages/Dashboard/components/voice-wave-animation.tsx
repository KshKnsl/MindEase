import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface VoiceWaveAnimationProps {
  isActive?: boolean
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function VoiceWaveAnimation({ 
  isActive = true, 
  color = '#7c3aed', 
  size = 'md',
  className = ''
}: VoiceWaveAnimationProps) {
  const [waves, setWaves] = useState<number[]>([])
  
  // Size mappings
  const sizeMap = {
    sm: {
      containerSize: 'w-16 h-16',
      waveCount: 3,
      maxHeight: 20
    },
    md: {
      containerSize: 'w-24 h-24',
      waveCount: 5,
      maxHeight: 30
    },
    lg: {
      containerSize: 'w-32 h-32',
      waveCount: 7,
      maxHeight: 40
    }
  }
  
  const { containerSize, waveCount, maxHeight } = sizeMap[size]
  
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setWaves(Array.from({ length: waveCount }, () => Math.random() * maxHeight + 5))
      }, 100)
      
      return () => clearInterval(interval)
    } else {
      setWaves(Array.from({ length: waveCount }, () => 3))
    }
  }, [isActive, waveCount, maxHeight])
  
  return (
    <div className={`flex items-center justify-center gap-1 ${containerSize} ${className}`}>
      {waves.map((height, index) => (
        <motion.div
          key={index}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            height: isActive ? height : 3
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}
