import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface DropdownProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
  isDropdownOpen?: boolean;
  onOpenChange?: (isDropdownOpen: boolean) => void;
  variant?: 'default' | 'cosmic' | 'toolbox' | 'red' | 'green' | 'blue' | 'sage' | 'orange';
}

export const Dropdown = ({
  children,
  className = "",
  align = "left",
  isDropdownOpen: isDropdownOpenProp,
  onOpenChange,
  variant = 'default',
}: DropdownProps) => {
  const [isDropdownOpenInternal, setIsDropdownOpenInternal] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const isControlled = isDropdownOpenProp !== undefined;
  const isDropdownOpen = isControlled
    ? isDropdownOpenProp
    : isDropdownOpenInternal;

  const toggleDropdown = () => {
    const newState = !isDropdownOpen;
    if (!isControlled) setIsDropdownOpenInternal(newState);
    onOpenChange?.(newState);
  };

  const handleClickOutside = () => {
    if (!isControlled) setIsDropdownOpenInternal(false);
    onOpenChange?.(false);
  };

  return (
    <div className={twMerge("relative", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...(child.type === DropdownTrigger
              ? { toggleDropdown, setTriggerWidth, isDropdownOpen }
              : {}),
            ...(child.type === DropdownContent
              ? {
                isDropdownOpen,
                align,
                triggerWidth,
                handleClickOutside,
                variant,
              }
              : {}),
          });
        }
        return child;
      })}
    </div>
  );
};

interface DropdownTriggerProps {
  children: React.ReactNode;
  toggleDropdown?: () => void;
  setTriggerWidth?: (width: number) => void;
}

export const DropdownTrigger = ({
  children,
  toggleDropdown,
  setTriggerWidth,
}: DropdownTriggerProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (triggerRef.current && setTriggerWidth) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [setTriggerWidth]);

  return (
    <div
      ref={triggerRef}
      className="dropdown-trigger cursor-pointer"
      onClick={toggleDropdown}
    >
      {children}
    </div>
  );
};

interface DropdownContentProps {
  children: React.ReactNode;
  isDropdownOpen?: boolean;
  align?: "left" | "right" | "center"; // Add "center" to the align options
  triggerWidth?: number;
  className?: string;
  handleClickOutside?: () => void;
  variant?: 'default' | 'cosmic' | 'toolbox' | 'red' | 'green' | 'blue' | 'sage' | 'orange';
}

export const DropdownContent = ({
  children,
  isDropdownOpen,
  align = "left",
  triggerWidth,
  className = "",
  handleClickOutside,
  variant = 'default',
}: DropdownContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        handleClickOutside?.();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handleClickOutside]);

  if (!isDropdownOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={handleClickOutside}
      />
      <div
        ref={contentRef}
        className={twMerge(
          "absolute z-50 mt-2 rounded shadow-lg",
          (() => {

            const variantClasses = {
              default: "bg-white text-black dark:bg-black border border-gray-200 dark:border-gray-700",
              cosmic: "bg-slate-900/95 backdrop-blur-xl border border-purple-400/50 rounded-lg shadow-purple-500/30 shadow-lg",
              toolbox: "bg-gray-900/90 backdrop-blur-sm border border-slate-500/30 shadow-slate-500/30",
              red: "bg-black/90 backdrop-blur-sm border border-red-500/30 shadow-red-500/30",
              green: "bg-black/90 backdrop-blur-sm border border-green-500/30 shadow-green-500/30",
              blue: "bg-black/90 backdrop-blur-sm border border-blue-500/30 shadow-blue-500/30",
              sage: "bg-black/90 backdrop-blur-sm border border-green-600/30 shadow-green-600/30",
              orange: "bg-black/90 backdrop-blur-sm border border-orange-500/30 shadow-orange-500/30",
            }
            return variantClasses[variant]
          })(),
          align === "left"
            ? "left-0"
            : align === "right"
              ? "right-0"
              : "left-1/2 -translate-x-1/2 transform", // Center alignment logic
          className,
        )}
        style={{ minWidth: triggerWidth }}
      >
        {children}
      </div>
    </>
  );
};
