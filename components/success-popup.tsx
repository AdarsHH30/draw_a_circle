"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SuccessPopupProps {
  accuracy: number;
  onClose: () => void;
}

export default function SuccessPopup({ accuracy, onClose }: SuccessPopupProps) {
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showNextLink, setShowNextLink] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setVisible(true), 100);

    // Show next link with delay for dramatic effect
    const nextLinkTimer = setTimeout(() => {
      setShowNextLink(true);
    }, 1000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      clearTimeout(nextLinkTimer);
      setVisible(false);
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
        "fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
      onClick={handleClose}
    >
      {/* Popup content */}
      <div
        className={cn(
          "bg-gray-900 border border-green-500 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg",
          "transition-all duration-300",
          visible ? "transform-none" : "translate-y-8 scale-95"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h2 className="text-2xl font-semibold text-white mb-2">Success</h2>
          <p className="text-gray-400 mb-6">You've drawn a perfect circle!</p>

          <div className="bg-gray-800 rounded-lg p-4 w-full mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">Accuracy</span>
              <span className="text-green-400 text-sm font-medium">
                {accuracy.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-2 transition-all duration-1000 ease-out"
                style={{
                  width: `${accuracy}%`,
                }}
              />
            </div>
          </div>

          {/* Next Round Link */}
          {showNextLink ? (
            <Link
              href="https://digital-hunt-is.deeeep.fun/debugthecode"
              className={cn(
                "bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg",
                "py-3 px-6 flex items-center justify-center gap-2 w-full transition-all",
                "shadow-md hover:shadow-lg"
              )}
            >
              Continue to Next Round <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          ) : (
            <div className="h-12 w-full flex items-center justify-center">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
