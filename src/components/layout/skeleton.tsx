import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'cosmic' | 'toolbox' | 'red' | 'green' | 'blue' | 'sage' | 'orange';
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'bg-gray-200 dark:bg-primary-dark',
    cosmic: 'bg-gray-600/60 dark:bg-black/50',
    toolbox: 'bg-gray-700/40 dark:bg-slate-900/30',
    red: 'bg-gray-700/40 dark:bg-red-900/30',
    green: 'bg-gray-700/40 dark:bg-green-900/30',
    blue: 'bg-gray-700/40 dark:bg-blue-900/30',
    sage: 'bg-gray-700/40 dark:bg-green-900/30',
    orange: 'bg-gray-700/40 dark:bg-orange-900/30',
  }

  return (
    <div
      ref={ref}
      className={twMerge("animate-pulse rounded-md", variantClasses[variant], className)}
      {...props}
    />
  )
});

Skeleton.displayName = "Skeleton";

export { Skeleton };

