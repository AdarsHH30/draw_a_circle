"use client";

import { useEffect, useState } from "react";
import { Trophy, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SuccessPopupProps {
  accuracy: number;
  onClose: () => void;
}

export default function SuccessPopup({ accuracy, onClose }: SuccessPopupProps) {
  const [visible, setVisible] = useState(false);
  const [pixels, setPixels] = useState<
    { x: number; y: number; color: string }[]
  >([]);
  const [isClosing, setIsClosing] = useState(false);
  const [showNextLink, setShowNextLink] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setVisible(true), 100);

    // Generate pixel particles
    const particles = [];
    const colors = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setPixels(particles);

    // Show next link with delay for dramatic effect
    const nextLinkTimer = setTimeout(() => {
      setShowNextLink(true);
    }, 1500);

    // Cleanup
    return () => {
      clearTimeout(timer);
      clearTimeout(nextLinkTimer);
      setVisible(false);
      setPixels([]);
    };
  }, []);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-300 scanline-effect",
        visible ? "opacity-100" : "opacity-0"
      )}
      onClick={handleClose}
    >
      {/* Pixel particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {pixels.map((pixel, i) => (
          <div
            key={i}
            className="absolute animate-pixel-fall"
            style={{
              left: `${pixel.x}%`,
              top: `${pixel.y - 100}%`,
              width: `8px`,
              height: `8px`,
              backgroundColor: pixel.color,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Popup content */}
      <div
        className={cn(
          "bg-gray-900 pixel-border-success p-6 max-w-md w-full mx-4 shadow-[0_0_0_4px_#065f46,0_0_0_8px_#064e3b]",
          "transition-all duration-300 pixel-container crt-effect",
          visible ? "transform-none" : "translate-y-8 scale-95"
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
          <div className="w-20 h-20 pixel-border-success bg-emerald-900/30 flex items-center justify-center mb-6 rotate-animation">
            <Trophy className="w-12 h-12 text-emerald-400" />
          </div>

          <h2 className="text-2xl font-pixel text-white mb-2 pixel-shadow glitch-text">
            VICTORY!
          </h2>
          <p className="text-gray-400 mb-6 font-pixel text-sm">
            PERFECT CIRCLE ACHIEVED
          </p>

          <div className="bg-gray-800 pixel-border p-4 w-full mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 font-pixel text-xs">ACCURACY</span>
              <span className="text-emerald-400 font-pixel text-xs">
                {accuracy.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 h-4 pixel-border-thin">
              <div
                className="bg-emerald-500 h-4 progress-animation"
                style={{
                  width: `${accuracy}%`,
                  animationDuration: "1s",
                }}
              />
            </div>
          </div>

          {/* Next Round Link */}
          {showNextLink ? (
            <Link
              href="https://digital-hunt-is.deeeep.fun/theciphergame"
              className={cn(
                "bg-purple-600 hover:bg-purple-500 text-white font-pixel pixel-button",
                "py-3 px-6 flex items-center justify-center gap-2 w-full transition-all",
                "scale-in-animation"
              )}
            >
              NEXT ROUND <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          ) : (
            <div className="h-12 w-full flex items-center justify-center">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
