"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FailurePopupProps {
  reason: string;
  accuracy: number;
  onClose: () => void;
}

export default function FailurePopup({
  reason,
  accuracy,
  onClose,
}: FailurePopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setVisible(true), 100);

    // Cleanup
    return () => {
      setVisible(false);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
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
          "bg-gray-900 pixel-border-failure p-6 max-w-md w-full mx-4 shadow-[0_0_0_4px_#7f1d1d,0_0_0_8px_#450a0a]",
          "transition-all duration-300 pixel-container",
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
          <div className="w-20 h-20 pixel-border-failure bg-red-900/30 flex items-center justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>

          <h2 className="text-2xl font-pixel text-white mb-2 pixel-shadow">
            FAILED!
          </h2>
          <p className="text-gray-400 mb-6 font-pixel text-sm">
            {reason.toUpperCase()}
          </p>

          {accuracy > 0 && (
            <div className="bg-gray-800 pixel-border p-4 w-full mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 font-pixel text-xs">
                  ACCURACY
                </span>
                <span className="text-red-400 font-pixel text-xs">
                  {accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 h-4 pixel-border-thin">
                <div
                  className="bg-red-500 h-4"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>
          )}

          <Button
            onClick={handleClose}
            className="bg-red-600 hover:bg-red-500 text-white border-0 font-pixel pixel-button"
          >
            TRY AGAIN
          </Button>
        </div>
      </div>
    </div>
  );
}
