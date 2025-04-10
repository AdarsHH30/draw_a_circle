"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";

interface Point {
  x: number;
  y: number;
}

interface CircleDrawingProps {
  onCircleDrawn: (isCircle: boolean, accuracy: number) => void;
  onSpeedFailure: () => void;
  onMidDrawingFailure: () => void;
  onDrawingStart: () => void;
  accuracyThreshold: number; // Added prop for accuracy threshold
}

export default function CircleDrawing({
  onCircleDrawn,
  onSpeedFailure,
  onMidDrawingFailure,
  onDrawingStart,
  accuracyThreshold = 90, // Default to 90% as requested
}: CircleDrawingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });

  // Refs for time tracking
  const lastPointTimeRef = useRef<number>(0);
  const speedCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const midDrawingCheckRef = useRef<boolean>(false);
  const drawingCompleteRef = useRef<boolean>(false);

  // Constants for game mechanics
  const MAX_POINT_DELAY_MS = 300; // Maximum time allowed between points (ms)
  const MID_DRAWING_CHECK_THRESHOLD = 0.5; // Check accuracy after this portion of the circle
  const MID_DRAWING_MIN_ACCURACY = 40; // Minimum accuracy required at mid-point check

  useEffect(() => {
    const handleResize = () => {
      const size = Math.min(window.innerWidth - 40, 500);
      setCanvasSize({ width: size, height: size });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clean up intervals when component unmounts
  useEffect(() => {
    return () => {
      if (speedCheckIntervalRef.current) {
        clearInterval(speedCheckIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas background - pixel art style
    ctx.fillStyle = "#0f172a"; // Dark blue background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pixel grid (subtle)
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw guide circle - pixelated style
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    // Draw pixelated circle
    drawPixelatedCircle(ctx, centerX, centerY, radius, "#334155");

    // Draw center point - pixelated
    ctx.fillStyle = "#475569";
    ctx.fillRect(centerX - 4, centerY - 4, 8, 8);

    // Draw user's path - pixelated style
    if (points.length > 1) {
      for (let i = 1; i < points.length; i++) {
        const prevPoint = points[i - 1];
        const currentPoint = points[i];

        // Draw pixelated line segment
        drawPixelatedLine(
          ctx,
          prevPoint.x,
          prevPoint.y,
          currentPoint.x,
          currentPoint.y,
          "#10b981", // Emerald color
          3
        );
      }
    }
  }, [points, canvasSize]);

  // Draw a pixelated circle
  const drawPixelatedCircle = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    color: string
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    // Draw a dashed circle with pixel-like segments
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // Draw a pixelated line
  const drawPixelatedLine = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    pixelSize: number
  ) => {
    ctx.fillStyle = color;

    // Calculate the distance and direction
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Draw pixels along the line
    const steps = Math.max(Math.ceil(distance / (pixelSize / 2)), 1);
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const x = Math.round((x1 + dx * t) / pixelSize) * pixelSize;
      const y = Math.round((y1 + dy * t) / pixelSize) * pixelSize;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    // Reset state for new drawing
    setIsDrawing(true);
    setPoints([]);
    midDrawingCheckRef.current = false;
    drawingCompleteRef.current = false;
    onDrawingStart();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const point = getPointFromEvent(e, rect);

    setPoints([point]);

    // Start tracking time for speed check
    lastPointTimeRef.current = Date.now();

    // Set up interval to check for inactivity
    if (speedCheckIntervalRef.current) {
      clearInterval(speedCheckIntervalRef.current);
    }

    speedCheckIntervalRef.current = setInterval(() => {
      const now = Date.now();
      if (now - lastPointTimeRef.current > MAX_POINT_DELAY_MS) {
        stopDrawing(true);
      }
    }, 100);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const point = getPointFromEvent(e, rect);

    setPoints((prevPoints) => {
      const newPoints = [...prevPoints, point];

      // Update last point time
      lastPointTimeRef.current = Date.now();

      // Check mid-drawing accuracy if we've drawn enough points
      if (!midDrawingCheckRef.current && newPoints.length > 20) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const targetRadius = Math.min(canvas.width, canvas.height) * 0.35;

        // Calculate how much of a circle we've drawn (based on angle coverage)
        const angles = newPoints.map((p) =>
          Math.atan2(p.y - centerY, p.x - centerX)
        );
        const minAngle = Math.min(...angles);
        const maxAngle = Math.max(...angles);
        let angleCoverage = maxAngle - minAngle;
        if (angleCoverage < 0) angleCoverage += Math.PI * 2;

        // If we've drawn more than half a circle, check accuracy
        if (angleCoverage > Math.PI) {
          midDrawingCheckRef.current = true;
          const accuracy = calculateAccuracy(
            newPoints,
            centerX,
            centerY,
            targetRadius
          );

          // If accuracy is too low, stop drawing and signal failure
          if (accuracy < MID_DRAWING_MIN_ACCURACY) {
            setTimeout(() => {
              stopDrawing(false);
              onMidDrawingFailure();
            }, 0);
          }
        }
      }

      return newPoints;
    });
  };

  const stopDrawing = (isTimeout = false) => {
    // Prevent multiple calls
    if (!isDrawing || drawingCompleteRef.current) return;

    setIsDrawing(false);
    drawingCompleteRef.current = true;

    // Clear speed check interval
    if (speedCheckIntervalRef.current) {
      clearInterval(speedCheckIntervalRef.current);
      speedCheckIntervalRef.current = null;
    }

    // If stopped due to timeout and we have some points, trigger speed failure
    if (isTimeout && points.length > 5) {
      onSpeedFailure();
      return;
    }

    if (points.length < 20) return; // Not enough points to analyze

    analyzeCircle();
  };

  const getPointFromEvent = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
    rect: DOMRect
  ): Point => {
    let clientX: number, clientY: number;

    if ("touches" in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  // Calculate accuracy for a set of points
  const calculateAccuracy = (
    pointsToCheck: Point[],
    centerX: number,
    centerY: number,
    targetRadius: number
  ): number => {
    // Calculate average radius and variance
    let sumRadius = 0;
    const radii: number[] = [];

    for (const point of pointsToCheck) {
      const dx = point.x - centerX;
      const dy = point.y - centerY;
      const radius = Math.sqrt(dx * dx + dy * dy);
      radii.push(radius);
      sumRadius += radius;
    }

    const avgRadius = sumRadius / pointsToCheck.length;

    // Calculate standard deviation of radii
    let sumVariance = 0;
    for (const radius of radii) {
      sumVariance += Math.pow(radius - avgRadius, 2);
    }

    const stdDev = Math.sqrt(sumVariance / radii.length);

    // Calculate coefficient of variation (lower is better for a circle)
    const cv = stdDev / avgRadius;

    // Calculate accuracy percentage (inverse of coefficient of variation, normalized)
    const maxCV = 0.5; // Maximum acceptable CV
    return Math.max(0, Math.min(100, (1 - cv / maxCV) * 100));
  };

  const analyzeCircle = () => {
    const canvas = canvasRef.current;
    if (!canvas || points.length < 20) return;

    // Find center of mass
    let sumX = 0,
      sumY = 0;
    for (const point of points) {
      sumX += point.x;
      sumY += point.y;
    }

    const centerX = sumX / points.length;
    const centerY = sumY / points.length;

    // Calculate accuracy
    const targetRadius = Math.min(canvas.width, canvas.height) * 0.35;
    const accuracy = calculateAccuracy(points, centerX, centerY, targetRadius);

    // Check if the shape is closed
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const distance = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) +
        Math.pow(lastPoint.y - firstPoint.y, 2)
    );

    const isClosed = distance < targetRadius * 0.2;

    // A good circle has good accuracy and is closed
    // Using accuracyThreshold (90%) as requested
    const isCircle = accuracy >= accuracyThreshold && isClosed;

    onCircleDrawn(isCircle, accuracy);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="pixel-border overflow-hidden bg-gray-900 shadow-[0_0_0_4px_#1e293b,0_0_0_8px_#0f172a] crt-effect">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={() => stopDrawing()}
          onMouseLeave={() => stopDrawing()}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={() => stopDrawing()}
          className="touch-none pixel-canvas"
        />
      </div>
      <p className="mt-4 text-gray-400 text-center font-pixel text-xs blink-slow">
        FOLLOW THE DOTTED GUIDE. DRAW QUICKLY AND STEADILY.
      </p>
    </div>
  );
}
