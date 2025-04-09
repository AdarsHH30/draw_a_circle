"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface Point {
  x: number
  y: number
}

interface CircleDrawingProps {
  onCircleDrawn: (isCircle: boolean, accuracy: number) => void
}

export default function CircleDrawing({ onCircleDrawn }: CircleDrawingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [points, setPoints] = useState<Point[]>([])
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 })

  useEffect(() => {
    const handleResize = () => {
      const size = Math.min(window.innerWidth - 40, 500)
      setCanvasSize({ width: size, height: size })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas background
    ctx.fillStyle = "#1f2937" // Dark gray background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw guide circle
    ctx.beginPath()
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.35
    ctx.strokeStyle = "#4b5563" // Gray guide circle
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw center point
    ctx.beginPath()
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2)
    ctx.fillStyle = "#6b7280"
    ctx.fill()

    // Draw user's path
    if (points.length > 0) {
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.strokeStyle = "#10b981" // Emerald color for drawing
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
    }
  }, [points, canvasSize])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    setPoints([])

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const point = getPointFromEvent(e, rect)

    setPoints([point])
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const point = getPointFromEvent(e, rect)

    setPoints((prevPoints) => [...prevPoints, point])
  }

  const stopDrawing = () => {
    setIsDrawing(false)

    if (points.length < 20) return // Not enough points to analyze

    analyzeCircle()
  }

  const getPointFromEvent = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    rect: DOMRect,
  ): Point => {
    let clientX: number, clientY: number

    if ("touches" in e) {
      // Touch event
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      // Mouse event
      clientX = e.clientX
      clientY = e.clientY
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const analyzeCircle = () => {
    const canvas = canvasRef.current
    if (!canvas || points.length < 20) return

    // Find center of mass
    let sumX = 0,
      sumY = 0
    for (const point of points) {
      sumX += point.x
      sumY += point.y
    }

    const centerX = sumX / points.length
    const centerY = sumY / points.length

    // Calculate average radius and variance
    let sumRadius = 0
    const radii: number[] = []

    for (const point of points) {
      const dx = point.x - centerX
      const dy = point.y - centerY
      const radius = Math.sqrt(dx * dx + dy * dy)
      radii.push(radius)
      sumRadius += radius
    }

    const avgRadius = sumRadius / points.length

    // Calculate standard deviation of radii
    let sumVariance = 0
    for (const radius of radii) {
      sumVariance += Math.pow(radius - avgRadius, 2)
    }

    const stdDev = Math.sqrt(sumVariance / radii.length)

    // Calculate coefficient of variation (lower is better for a circle)
    const cv = stdDev / avgRadius

    // Check if the shape is closed
    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]
    const distance = Math.sqrt(Math.pow(lastPoint.x - firstPoint.x, 2) + Math.pow(lastPoint.y - firstPoint.y, 2))

    const isClosed = distance < avgRadius * 0.2

    // Calculate accuracy percentage (inverse of coefficient of variation, normalized)
    // Lower CV means higher accuracy
    const maxCV = 0.5 // Maximum acceptable CV
    const accuracy = Math.max(0, Math.min(100, (1 - cv / maxCV) * 100))

    // A good circle has low coefficient of variation and is closed
    // Changed threshold to 70% as requested
    const isCircle = accuracy >= 70 && isClosed

    onCircleDrawn(isCircle, accuracy)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="border-2 border-gray-700 rounded-lg overflow-hidden bg-gray-800 shadow-lg shadow-emerald-900/20">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="touch-none"
        />
      </div>
      <p className="mt-4 text-gray-400 text-center">
        Draw a circle following the dotted guide. Release to check your accuracy.
      </p>
    </div>
  )
}

