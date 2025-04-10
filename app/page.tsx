"use client";

import { useState, useEffect } from "react";
import CircleDrawing from "@/components/circle-drawing";
import SuccessPopup from "@/components/success-popup";
import FailurePopup from "@/components/failure-popup";
import { Zap } from "lucide-react";

export default function Home() {
  const [gameState, setGameState] = useState<
    "idle" | "drawing" | "success" | "failure"
  >("idle"); const [accuracy, setAccuracy] = useState<number | null>(null);
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-950 text-gray-100 pixel-pattern scanline-effect">
      <div className="max-w-3xl w-full space-y-8 pixel-container">
        <div className="text-center pixel-text">
          <h1 className="text-3xl font-pixel text-white mb-2 pixel-shadow glitch-text">
            CIRCLE QUEST
          </h1>
          <div className="pixel-border p-2 mb-6 bg-gray-900/50">
            <p className="text-md text-gray-400 font-pixel blink-slow">
              Draw a 90% circle to get the next round link
            </p>
          </div>
        </div>

        {/* Game status indicator */}
        <div className="flex justify-center mb-4">
          <div className="pixel-border bg-gray-900/70 p-2 flex items-center">
            <div
              className={`w-3 h-3 mr-2 ${gameState === "idle"
                ? "bg-yellow-500 blink-fast"
                : gameState === "drawing"
                  ? "bg-blue-500"
                  : gameState === "success"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
            ></div>
            <span className="font-pixel text-xs uppercase">
              {gameState === "idle"
                ? "READY"
                : gameState === "drawing"
                  ? "DRAWING"
                  : gameState === "success"
                    ? "SUCCESS"
                    : "FAILED"}
            </span>
          </div>
        </div>

        <CircleDrawing
          key={gameKey}
          onCircleDrawn={handleCircleDrawn}
          onSpeedFailure={handleSpeedFailure}
          onMidDrawingFailure={handleMidDrawingFailure}
          onDrawingStart={() => setGameState("drawing")}
          accuracyThreshold={85} // Updated to 90%
        />

        {accuracy !== null &&
          gameState !== "success" &&
          gameState !== "failure" && (
            <div className="mt-4 text-center">
              <p className="text-gray-400 font-pixel">
                ACCURACY:{" "}
                <span
                  className={
                    accuracy >= 90 ? "text-green-400" : "text-yellow-400"
                  }
                >
                  {accuracy.toFixed(1)}%
                </span>
              </p>
            </div>
          )}

      </div>

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
    </main>
  );
}
