"use client"

import { useState } from "react"
import CircleDrawing from "@/components/circle-drawing"
import SuccessPopup from "@/components/success-popup"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function Home() {
  const [message, setMessage] = useState<string>("")
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const handleCircleDrawn = (isCircle: boolean, accuracyValue: number) => {
    setAccuracy(accuracyValue)
    if (isCircle) {
      setMessage("Perfect circle detected!")
      setShowSuccessPopup(true)
    } else {
      setMessage("Not quite a circle. Try again!")
    }
  }

  const handleReset = () => {
    setMessage("")
    setAccuracy(null)
    setShowSuccessPopup(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-950 text-gray-100">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Circle Master</h1>
          <p className="text-lg text-gray-400 mb-6">Draw a circle with at least 70% accuracy to succeed</p>
        </div>

        <CircleDrawing onCircleDrawn={handleCircleDrawn} />

        {accuracy !== null && (
          <div className="mt-4 text-center">
            <p className="text-gray-400">
              Accuracy:{" "}
              <span className={accuracy >= 70 ? "text-emerald-400" : "text-amber-400"}>{accuracy.toFixed(1)}%</span>
            </p>
          </div>
        )}

        {message && !showSuccessPopup && (
          <div
            className={`mt-6 p-4 rounded-lg text-center text-lg font-medium ${
              message.includes("Perfect")
                ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800"
                : "bg-amber-950/50 text-amber-400 border border-amber-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button
            onClick={handleReset}
            variant="outline"
            className="px-4 py-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {showSuccessPopup && <SuccessPopup accuracy={accuracy || 0} onClose={() => setShowSuccessPopup(false)} />}
    </main>
  )
}

