"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"

export default function NextRound() {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("LOADING NEXT CHALLENGE...")
  const router = useRouter()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
      setMessage("CONGRATULATIONS! YOU'VE COMPLETED THE CIRCLE QUEST!")
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-950 text-gray-100 pixel-pattern scanline-effect">
      <div className="max-w-3xl w-full space-y-8 pixel-container">
        <div className="text-center pixel-text">
          <h1 className="text-3xl font-pixel text-white mb-2 pixel-shadow glitch-text">NEXT ROUND</h1>

          <div className="pixel-border p-6 mb-6 bg-gray-900/50">
            {loading ? (
              <div className="flex flex-col items-center space-y-4">
                <p className="text-md text-gray-400 font-pixel blink-slow">{message}</p>
                <div className="loading-dots mt-4">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6">
                <p className="text-md text-emerald-400 font-pixel">{message}</p>

                <div className="flex justify-center space-x-2 my-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-yellow-400 rotate-animation"
                      style={{ animationDuration: `${3 + i * 0.5}s` }}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-400 font-pixel">YOU'VE MASTERED THE ART OF CIRCLE DRAWING!</p>
              </div>
            )}
          </div>

          <Link
            href="/"
            className="bg-purple-600 hover:bg-purple-500 text-white font-pixel pixel-button py-3 px-6 flex items-center justify-center gap-2 w-full max-w-xs mx-auto"
          >
            <ArrowLeft className="h-4 w-4" /> BACK TO START
          </Link>
        </div>
      </div>
    </main>
  )
}
