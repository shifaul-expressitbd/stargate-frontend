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
  variant?: 'default' | 'cosmic' | 'toolbox' | 'red' | 'green' | 'blue' | 'sage' | 'orange';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className,
  position = "top",
  delay = 300,
  showArrow = true,
  variant = 'default',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Tooltip position classes for portal rendering
  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 transform -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 transform -translate-x-1/2",
    left: "right-full mr-2 top-1/2 transform -translate-y-1/2",
    right: "left-full ml-2 top-1/2 transform -translate-y-1/2",
  };

  // Theme-aware arrow colors
  const getArrowColor = (variant: string) => {
    const arrowColors = {
      default: 'border-gray-800 dark:border-gray-700',
      cosmic: 'border-cyan-400',
      toolbox: 'border-slate-400',
      red: 'border-red-400',
      green: 'border-green-400',
      blue: 'border-blue-400',
      sage: 'border-green-500',
      orange: 'border-orange-400',
    }
    return arrowColors[variant as keyof typeof arrowColors] || arrowColors.default
  }

  // Arrow classes for portal rendering
  const arrowClasses = {
    top: `-bottom-1 left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent ${getArrowColor(variant)}`,
    bottom: `-top-1 left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent ${getArrowColor(variant)}`,
    left: `-right-1 top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent ${getArrowColor(variant)}`,
    right: `-left-1 top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent ${getArrowColor(variant)}`,
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
                "text-white text-xs px-3 py-2 rounded-lg shadow-lg",
                (() => {
                  const tooltipClasses = {
                    default: "bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-600",
                    cosmic: "bg-black/90 backdrop-blur-sm border border-cyan-400/30 text-cyan-100",
                    toolbox: "bg-gray-900/90 backdrop-blur-sm border border-slate-500/30 text-slate-100",
                    red: "bg-black/90 backdrop-blur-sm border border-red-500/30 text-red-100",
                    green: "bg-black/90 backdrop-blur-sm border border-green-500/30 text-green-100",
                    blue: "bg-black/90 backdrop-blur-sm border border-blue-500/30 text-blue-100",
                    sage: "bg-black/90 backdrop-blur-sm border border-green-600/30 text-green-100",
                    orange: "bg-black/90 backdrop-blur-sm border border-orange-500/30 text-orange-100",
                  }
                  return tooltipClasses[variant as keyof typeof tooltipClasses] || tooltipClasses.default
                })(),
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
                      (() => {
                        const arrowFill = {
                          default: position === "top" ? "border-t-gray-800 dark:border-t-gray-700" :
                            position === "bottom" ? "border-b-gray-800 dark:border-b-gray-700" :
                              position === "left" ? "border-l-gray-800 dark:border-l-gray-700" : "border-r-gray-800 dark:border-r-gray-700",
                          cosmic: position === "top" ? "border-t-cyan-400" :
                            position === "bottom" ? "border-b-cyan-400" :
                              position === "left" ? "border-l-cyan-400" : "border-r-cyan-400",
                          toolbox: position === "top" ? "border-t-slate-400" :
                            position === "bottom" ? "border-b-slate-400" :
                              position === "left" ? "border-l-slate-400" : "border-r-slate-400",
                          red: position === "top" ? "border-t-red-400" :
                            position === "bottom" ? "border-b-red-400" :
                              position === "left" ? "border-l-red-400" : "border-r-red-400",
                          green: position === "top" ? "border-t-green-400" :
                            position === "bottom" ? "border-b-green-400" :
                              position === "left" ? "border-l-green-400" : "border-r-green-400",
                          blue: position === "top" ? "border-t-blue-400" :
                            position === "bottom" ? "border-b-blue-400" :
                              position === "left" ? "border-l-blue-400" : "border-r-blue-400",
                          sage: position === "top" ? "border-t-green-500" :
                            position === "bottom" ? "border-b-green-500" :
                              position === "left" ? "border-l-green-500" : "border-r-green-500",
                          orange: position === "top" ? "border-t-orange-400" :
                            position === "bottom" ? "border-b-orange-400" :
                              position === "left" ? "border-l-orange-400" : "border-r-orange-400",
                        }
                        const color = arrowFill[variant as keyof typeof arrowFill] || arrowFill.default
                        return color
                      })(),
                      position === "top" && "-bottom-[3px] left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent",
                      position === "bottom" && "-top-[3px] left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent",
                      position === "left" && "-right-[3px] top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent",
                      position === "right" && "-left-[3px] top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent"
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
