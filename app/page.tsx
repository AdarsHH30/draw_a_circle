"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CircleDrawing from "@/components/circle-drawing";
import SuccessPopup from "@/components/success-popup";
import FailurePopup from "@/components/failure-popup";
import { Activity, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [gameState, setGameState] = useState<
    "idle" | "drawing" | "success" | "failure"
  >("idle");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [failureReason, setFailureReason] = useState<string>("");
  const [gameKey, setGameKey] = useState<number>(0); // Used to force component remount

  // Prevent multiple popups from appearing
  useEffect(() => {
    // Reset game state if needed
    return () => {
      if (gameState === "success" || gameState === "failure") {
        setGameState("idle");
      }
    };
  }, [gameState]);

  // Handle circle drawing completion
  const handleCircleDrawn = (isCircle: boolean, accuracyValue: number) => {
    // Only process if we're still in drawing state
    if (gameState !== "drawing") return;

    setAccuracy(accuracyValue);

    if (isCircle) {
      setGameState("success");
    } else {
      setFailureReason("Your circle wasn't accurate enough!");
      setGameState("failure");
    }
  };

  // Handle speed failure
  const handleSpeedFailure = () => {
    // Only process if we're still in drawing state
    if (gameState !== "drawing") return;

    setFailureReason("You're drawing too slowly!");
    setGameState("failure");
  };

  // Handle mid-drawing accuracy check failure
  const handleMidDrawingFailure = () => {
    // Only process if we're still in drawing state
    if (gameState !== "drawing") return;

    setFailureReason("Your circle is off track! Try again.");
    setGameState("failure");
  };

  // Reset the game
  const handleReset = () => {
    setGameState("idle");
    setAccuracy(null);
    setFailureReason("");
    setGameKey((prev) => prev + 1); // Force remount of CircleDrawing component
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-950 text-gray-100 relative overflow-hidden">
      <div className="max-w-3xl w-full space-y-8 flex-1">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Circle Quest
          </h1>
          <p className="text-gray-300 mb-8">
            Draw a circle with at least 90% accuracy to continue
          </p>
        </motion.div>

        {/* Game status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-3 flex items-center space-x-3">
              <div
                className={`status-indicator ${
                  gameState === "idle"
                    ? "bg-amber-500"
                    : gameState === "drawing"
                    ? "bg-blue-500"
                    : gameState === "success"
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {gameState === "idle"
                  ? "Ready to Draw"
                  : gameState === "drawing"
                  ? "Drawing in Progress"
                  : gameState === "success"
                  ? "Success"
                  : "Failed"}
              </span>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="canvas-container"
        >
          <CircleDrawing
            key={gameKey}
            onCircleDrawn={handleCircleDrawn}
            onSpeedFailure={handleSpeedFailure}
            onMidDrawingFailure={handleMidDrawingFailure}
            onDrawingStart={() => setGameState("drawing")}
            accuracyThreshold={90}
          />
        </motion.div>

        <AnimatePresence>
          {accuracy !== null &&
            gameState !== "success" &&
            gameState !== "failure" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 text-center"
              >
                <Card className="bg-gray-800/50 border-gray-700 inline-block">
                  <CardContent className="p-3 flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Accuracy: </span>
                    <span
                      className={
                        accuracy >= 90
                          ? "text-emerald-400 font-medium"
                          : "text-amber-400 font-medium"
                      }
                    >
                      {accuracy.toFixed(1)}%
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            )}
        </AnimatePresence>

        {gameState === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <Card className="bg-gray-800/50 border-gray-700 inline-block">
              <CardContent className="p-3 flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">
                  Start drawing to begin the challenge
                </span>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {gameState === "success" && (
          <SuccessPopup accuracy={accuracy || 0} onClose={handleReset} />
        )}

        {gameState === "failure" && (
          <FailurePopup
            reason={failureReason}
            accuracy={accuracy || 0}
            onClose={handleReset}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
