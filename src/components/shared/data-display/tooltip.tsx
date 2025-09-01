import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
  showArrow?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className,
  position = "top",
  delay = 300,
  showArrow = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Tooltip position classes for portal rendering
  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 transform -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 transform -translate-x-1/2",
    left: "right-full mr-2 top-1/2 transform -translate-y-1/2",
    right: "left-full ml-2 top-1/2 transform -translate-y-1/2",
  };

  // Arrow classes for portal rendering
  const arrowClasses = {
    top: "-bottom-1 left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800",
    bottom: "-top-1 left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800",
    left: "-right-1 top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800",
    right: "-left-1 top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800",
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className={twMerge(
                "fixed whitespace-nowrap opacity-0 transition-opacity duration-200 pointer-events-none",
                "bg-gray-800 dark:bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg",
                "border border-gray-700 dark:border-gray-600",
                positionClasses[position],
                className
              )}
              style={{
                zIndex: 9999,
                transitionDelay: `${delay}ms`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="relative"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
              >
                {content}
                {showArrow && (
                  <div
                    className={twMerge(
                      "absolute w-0 h-0",
                      position === "top" && "-bottom-1 left-1/2 transform -translate-x-1/2",
                      position === "bottom" && "-top-1 left-1/2 transform -translate-x-1/2",
                      position === "left" && "-right-1 top-1/2 transform -translate-y-1/2",
                      position === "right" && "-left-1 top-1/2 transform -translate-y-1/2"
                    )}
                  >
                    {/* Arrow outer border */}
                    <div className={twMerge("absolute w-0 h-0", arrowClasses[position])} />
                    {/* Arrow fill */}
                    <div className={twMerge(
                      "absolute w-0 h-0",
                      position === "top" && "-bottom-[3px] left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 dark:border-t-gray-700",
                      position === "bottom" && "-top-[3px] left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800 dark:border-b-gray-700",
                      position === "left" && "-right-[3px] top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800 dark:border-l-gray-700",
                      position === "right" && "-left-[3px] top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800 dark:border-r-gray-700"
                    )} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
