"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Award, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuccessPopupProps {
  accuracy: number
  onClose: () => void
}

export default function SuccessPopup({ accuracy, onClose }: SuccessPopupProps) {
  const [visible, setVisible] = useState(false)
  const [confetti, setConfetti] = useState<{ x: number; y: number; size: number; color: string }[]>([])

  useEffect(() => {
    // Animate in
    setTimeout(() => setVisible(true), 100)

    // Generate confetti particles
    const particles = []
    const colors = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    setConfetti(particles)

    // Cleanup
    return () => {
      setVisible(false)
      setConfetti([])
    }
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
      onClick={handleClose}
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((particle, i) => (
          <div
            key={i}
            className="absolute animate-fall"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y - 100}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              borderRadius: "50%",
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Popup content */}
      <div
        className={cn(
          "bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transition-all duration-300",
          visible ? "transform-none" : "translate-y-8 scale-95",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-900/30 flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Perfect Circle!</h2>
          <p className="text-gray-400 mb-6">You've drawn a circle with impressive precision.</p>

          <div className="bg-gray-800 rounded-lg p-4 w-full mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Accuracy</span>
              <span className="text-emerald-400 font-bold">{accuracy.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-2.5 rounded-full"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Award className="text-amber-400 w-5 h-5" />
            <span className="text-amber-400 font-medium">Achievement Unlocked: Circle Master</span>
          </div>

          <Button onClick={handleClose} className="bg-emerald-600 hover:bg-emerald-500 text-white border-0">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}

