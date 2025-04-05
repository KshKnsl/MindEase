

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdvancedSiriButton() {
  const [activate, setActivate] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isResponding, setIsResponding] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const wavePointsRef = useRef<WavePoint[]>([])
  const timeRef = useRef<number>(0)

  // Particle class for the fluid animation
  class Particle {
    x: number
    y: number
    size: number
    baseSize: number
    speedX: number
    speedY: number
    color: string
    opacity: number
    angle: number
    distance: number
    phaseOffset: number
    speedOffset: number

    constructor(angle: number, distance: number) {
      this.angle = angle
      this.distance = distance
      this.phaseOffset = Math.random() * Math.PI * 2
      this.speedOffset = Math.random() * 0.01 + 0.005
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      this.x = centerX + Math.cos(angle) * distance
      this.y = centerY + Math.sin(angle) * distance
      this.baseSize = Math.random() * 6 + 3
      this.size = this.baseSize
      this.speedX = Math.random() * 2 - 1
      this.speedY = Math.random() * 2 - 1
      this.opacity = Math.random() * 0.5 + 0.3

      // Colors similar to Siri with more variety
      const colors = [
        "rgba(88, 86, 214, 0.7)", // Purple
        "rgba(0, 122, 255, 0.7)", // Blue
        "rgba(52, 199, 255, 0.7)", // Light Blue
        "rgba(94, 92, 230, 0.7)", // Indigo
        "rgba(0, 179, 255, 0.7)", // Sky Blue
      ]
      this.color = colors[Math.floor(Math.random() * colors.length)]
    }

    update(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, activate: boolean, time: number) {
      if (activate) {
        // Create a continuous looping animation
        // Use sine and cosine with phase offsets for smooth looping
        this.angle += this.speedOffset

        // Breathe in and out with a sine wave
        const breatheFactor = Math.sin(time * 0.001 + this.phaseOffset) * 10
        this.distance = this.distance * 0.98 + (50 + breatheFactor) * 0.02

        // Pulsate size with a different frequency
        this.size = this.baseSize + Math.sin(time * 0.002 + this.phaseOffset * 3) * 2

        // Vary opacity with yet another frequency for more organic feel
        this.opacity = 0.3 + Math.sin(time * 0.003 + this.phaseOffset * 2) * 0.2
      } else {
        // When not active, particles should still have some subtle movement
        this.angle += 0.001
        this.distance = this.distance * 0.95 + (50 + Math.random() * 20) * 0.05
        this.size = this.baseSize
        this.opacity *= 0.98
      }

      // Calculate new position
      this.x = centerX + Math.cos(this.angle) * this.distance
      this.y = centerY + Math.sin(this.angle) * this.distance

      // Draw with glow effect
      ctx.save()
      ctx.globalAlpha = this.opacity
      ctx.fillStyle = this.color
      ctx.shadowColor = this.color
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  // Wave point class for the fluid wave animation
  class WavePoint {
    angle: number
    radius: number
    baseRadius: number
    speed: number
    phaseOffset: number

    constructor(angle: number) {
      this.angle = angle
      this.baseRadius = 60 + Math.random() * 10
      this.radius = this.baseRadius
      this.speed = 0.02 + Math.random() * 0.02
      this.phaseOffset = Math.random() * Math.PI * 2
    }

    update(time: number, intensity: number) {
      // Create wave-like motion with multiple sine waves for complexity
      const wave1 = Math.sin(time * 0.001 + this.angle * 3 + this.phaseOffset) * 5
      const wave2 = Math.sin(time * 0.002 + this.angle * 2 + this.phaseOffset) * 3
      const wave3 = Math.sin(time * 0.003 + this.angle + this.phaseOffset) * 2

      // Combine waves for a more complex, organic motion
      this.radius = this.baseRadius + (wave1 + wave2 + wave3) * intensity

      return {
        x: Math.cos(this.angle) * this.radius,
        y: Math.sin(this.angle) * this.radius,
      }
    }
  }

  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to full window
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create particles in a circular pattern
    particlesRef.current = []
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 60 + 40
      particlesRef.current.push(new Particle(angle, distance))
    }

    // Create wave points for the fluid boundary
    wavePointsRef.current = []
    const wavePointCount = 36 // More points for smoother curve
    for (let i = 0; i < wavePointCount; i++) {
      const angle = (i / wavePointCount) * Math.PI * 2
      wavePointsRef.current.push(new WavePoint(angle))
    }

    // Initialize time reference
    timeRef.current = Date.now()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - timeRef.current

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw fluid boundary
      if (activate) {
        // Draw the fluid wave boundary
        ctx.save()

        // Create gradient for the fluid boundary
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100)

        if (isResponding) {
          gradient.addColorStop(0, "rgba(120, 86, 214, 0.4)")
          gradient.addColorStop(0.5, "rgba(50, 122, 255, 0.3)")
          gradient.addColorStop(1, "rgba(52, 199, 255, 0)")
        } else {
          gradient.addColorStop(0, "rgba(88, 86, 214, 0.3)")
          gradient.addColorStop(0.5, "rgba(0, 122, 255, 0.2)")
          gradient.addColorStop(1, "rgba(52, 199, 255, 0)")
        }

        ctx.fillStyle = gradient
        ctx.beginPath()

        // Get first point
        const intensity = isListening ? 1.5 : isResponding ? 1.2 : 1
        const firstPoint = wavePointsRef.current[0].update(elapsed, intensity)
        ctx.moveTo(centerX + firstPoint.x, centerY + firstPoint.y)

        // Draw curve through all points
        for (let i = 1; i <= wavePointsRef.current.length; i++) {
          const current = wavePointsRef.current[i % wavePointsRef.current.length]
          const next = wavePointsRef.current[(i + 1) % wavePointsRef.current.length]

          const currentPoint = current.update(elapsed, intensity)
          const nextPoint = next.update(elapsed, intensity)

          // Calculate control points for smooth curve
          const cx = centerX + currentPoint.x
          const cy = centerY + currentPoint.y
          const nx = centerX + nextPoint.x
          const ny = centerY + nextPoint.y

          // Use quadratic curve for smoother appearance
          const cpx = (cx + nx) / 2
          const cpy = (cy + ny) / 2

          ctx.quadraticCurveTo(cx, cy, cpx, cpy)
        }

        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      // Draw particles
      particlesRef.current.forEach((particle) => {
        particle.update(ctx, centerX, centerY, activate, elapsed)
      })

      // Draw center glow
      if (activate) {
        ctx.save()

        // Pulsating opacity for the glow
        const glowOpacity = 0.7 + Math.sin(elapsed * 0.002) * 0.2
        ctx.globalAlpha = glowOpacity

        const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 70)

        if (isResponding) {
          glow.addColorStop(0, "rgba(255, 255, 255, 0.8)")
          glow.addColorStop(0.2, "rgba(255, 100, 255, 0.5)")
          glow.addColorStop(1, "rgba(100, 0, 255, 0)")
        } else if (isListening) {
          glow.addColorStop(0, "rgba(255, 255, 255, 0.8)")
          glow.addColorStop(0.2, "rgba(100, 200, 255, 0.5)")
          glow.addColorStop(1, "rgba(0, 100, 255, 0)")
        } else {
          glow.addColorStop(0, "rgba(255, 255, 255, 0.7)")
          glow.addColorStop(0.2, "rgba(100, 150, 255, 0.4)")
          glow.addColorStop(1, "rgba(0, 50, 255, 0)")
        }

        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(centerX, centerY, 70, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [activate, isListening, isResponding])

  // Handle button press with auto-looping demo
  const handlePress = () => {
    if (activate) {
      // If already active, deactivate
      setActivate(false)
      setIsListening(false)
      setIsResponding(false)
      return
    }

    // Start the activation sequence
    setActivate(true)
    setIsListening(true)

    // Simulate a response after 3 seconds
    setTimeout(() => {
      if (!activate) return // Check if still active
      setIsListening(false)
      setIsResponding(true)

      // After responding, go back to idle activated state
      setTimeout(() => {
        if (!activate) return // Check if still active
        setIsResponding(false)

        // Auto-loop the animation after a delay
        setTimeout(() => {
          if (!activate) return // Check if still active
          // Start the sequence again
          setIsListening(true)

          setTimeout(() => {
            if (!activate) return // Check if still active
            setIsListening(false)
            setIsResponding(true)

            setTimeout(() => {
              if (!activate) return // Check if still active
              setIsResponding(false)
            }, 2000)
          }, 3000)
        }, 2000)
      }, 2000)
    }, 3000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Canvas for fluid animation - covers entire screen */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" />

      {/* Center container for button */}
      <div className="relative z-10">
        {/* Main button */}
        <motion.button
          className="relative w-24 h-24 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center focus:outline-none"
          whileTap={{ scale: 0.95 }}
          onClick={handlePress}
          animate={{
            boxShadow: activate
              ? [
                  "0 0 0 rgba(120, 120, 255, 0.4)",
                  "0 0 20px rgba(120, 120, 255, 0.6)",
                  "0 0 0 rgba(120, 120, 255, 0.4)",
                ]
              : "0 0 0 rgba(120, 120, 255, 0)",
          }}
          transition={{
            duration: 2,
            repeat: activate ? Number.POSITIVE_INFINITY : 0,
            repeatType: "loop",
          }}
        >
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            animate={{
              scale: activate ? [1, 1.05, 1] : 1,
              background: isResponding
                ? [
                    "linear-gradient(to bottom right, #ec4899, #8b5cf6, #3b82f6)",
                    "linear-gradient(to bottom right, #d946ef, #8b5cf6, #3b82f6)",
                    "linear-gradient(to bottom right, #ec4899, #8b5cf6, #3b82f6)",
                  ]
                : isListening
                  ? [
                      "linear-gradient(to bottom right, #8b5cf6, #3b82f6, #06b6d4)",
                      "linear-gradient(to bottom right, #a78bfa, #60a5fa, #06b6d4)",
                      "linear-gradient(to bottom right, #8b5cf6, #3b82f6, #06b6d4)",
                    ]
                  : "linear-gradient(to bottom right, #8b5cf6, #3b82f6, #06b6d4)",
              boxShadow: activate
                ? [
                    "0 0 10px rgba(120, 120, 255, 0.5)",
                    "0 0 20px rgba(120, 120, 255, 0.7)",
                    "0 0 10px rgba(120, 120, 255, 0.5)",
                  ]
                : "0 0 0 rgba(120, 120, 255, 0)",
            }}
            transition={{
              duration: 2,
              repeat: activate ? Number.POSITIVE_INFINITY : 0,
              repeatType: "loop",
            }}
          />
        </motion.button>

        {/* Outer rings/waves */}
        <AnimatePresence>
          {activate && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-500/20 via-blue-400/20 to-cyan-300/20 z-0"
                  initial={{ width: 96, height: 96, opacity: 0 }}
                  animate={{
                    width: [96, 200 + i * 40],
                    height: [96, 200 + i * 40],
                    opacity: [0.7, 0],
                  }}
                  transition={{
                    duration: 1.5 + i * 0.3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    delay: i * 0.4,
                  }}
                  style={{
                    filter: "blur(8px)",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Audio visualization waves */}
        <AnimatePresence>
          {isListening && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
              {[...Array(18)].map((_, i) => (
                <motion.div
                  key={`wave-${i}`}
                  className="absolute top-1/2 left-1/2 w-1 bg-white rounded-full opacity-70"
                  initial={{ height: 5 }}
                  animate={{
                    height: [5 + Math.random() * 10, 15 + Math.random() * 15, 5 + Math.random() * 10],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 0.5 + Math.random() * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    delay: i * 0.05,
                  }}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${i * 20}deg) translateY(-40px)`,
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Status text */}
      <motion.p
        className="relative z-10 mt-8 text-white text-center opacity-80"
        animate={{
          opacity: [0.6, 1, 0.6],
          scale: activate ? [1, 1.02, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      >
        {isListening ? "Listening..." : isResponding ? "Responding..." : activate ? "Activated" : "Tap to activate"}
      </motion.p>
    </div>
  )
}

