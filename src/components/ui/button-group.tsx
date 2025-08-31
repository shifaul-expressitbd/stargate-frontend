import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonGroupProps {
  children?: React.ReactNode;
  align?: "left" | "center" | "right";
  spacing?: "none" | "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  className?: string;
  activeClassName?: string;
}

export const ButtonGroup = ({
  children,
  align = "left",
  spacing = "none",
  orientation = "horizontal",
  className,
  activeClassName = "bg-primary",
}: ButtonGroupProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Alignment classes
  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  // Spacing classes
  const spacingClasses = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  // Orientation classes
  const orientationClasses = {
    horizontal: "flex-row",
    vertical: "flex-col",
  };

  return (
    <div
      className={twMerge(
        "flex",
        alignmentClasses[align],
        spacingClasses[spacing],
        orientationClasses[orientation],
        className
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const childElement = child as React.ReactElement<{
            className?: string;
            onClick?: (e: React.MouseEvent) => void;
          }>;

          return React.cloneElement(childElement, {
            className: twMerge(
              childElement.props.className,
              activeIndex === index && activeClassName
            ),
            onClick: (e: React.MouseEvent) => {
              setActiveIndex(index);
              childElement.props.onClick?.(e);
            },
          });
        }
        return child;
      })}
    </div>
  );
};
