"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
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
          "bg-gray-900 border border-red-500 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg",
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
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>

          <h2 className="text-2xl font-semibold text-white mb-2">Not Quite</h2>
          <p className="text-gray-400 mb-6">{reason}</p>

          {accuracy > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 w-full mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Accuracy</span>
                <span className="text-red-400 text-sm font-medium">
                  {accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-2"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>
          )}

          <Button
            onClick={handleClose}
            className="bg-red-600 hover:bg-red-500 text-white border-0 font-medium rounded-lg w-full py-3"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
