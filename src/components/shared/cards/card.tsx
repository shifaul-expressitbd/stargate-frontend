import { forwardRef, type HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'filled'
  | 'cosmic' | 'cosmic-elevated' | 'cosmic-outline' | 'cosmic-filled'
  | 'toolbox' | 'toolbox-elevated' | 'toolbox-outline' | 'toolbox-filled'
  | 'red' | 'red-elevated' | 'red-outline' | 'red-filled'
  | 'green' | 'green-elevated' | 'green-outline' | 'green-filled'
  | 'blue' | 'blue-elevated' | 'blue-outline' | 'blue-filled'
  | 'sage' | 'sage-elevated' | 'sage-outline' | 'sage-filled'
  | 'orange' | 'orange-elevated' | 'orange-outline' | 'orange-filled';
  size?: 'default' | 'sm' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses =
      'rounded-lg border bg-card text-card-foreground shadow-sm';

    const variantClasses = {
      default: '',
      elevated: 'shadow-md',
      outline: 'border border-gray-200 dark:border-gray-700',
      filled: 'bg-gray-50 dark:bg-black',
      // Cosmic theme variants (Dark-optimized)
      cosmic: 'bg-black/70 backdrop-blur-md border border-cyan-400/60',
      'cosmic-elevated': 'bg-black/70 backdrop-blur-md border border-cyan-400/60 shadow-2xl shadow-cyan-500/40',
      'cosmic-outline': 'border-2 border-cyan-400/80 bg-black/30 backdrop-blur-md',
      'cosmic-filled': 'bg-gradient-to-br from-cyan-950/80 to-purple-950/80 backdrop-blur-md border border-cyan-400/60',
      // Toolbox theme variants
      toolbox: 'bg-gray-900/40 backdrop-blur-sm border border-slate-500/30',
      'toolbox-elevated': 'bg-gray-900/40 backdrop-blur-sm border border-slate-500/30 shadow-xl shadow-slate-500/30',
      'toolbox-outline': 'border-2 border-slate-500/60 bg-transparent backdrop-blur-sm',
      'toolbox-filled': 'bg-gradient-to-br from-slate-900/40 to-slate-800/40 backdrop-blur-sm border border-slate-500/30',
      // Red theme variants
      red: 'bg-black/40 backdrop-blur-sm border border-red-500/30',
      'red-elevated': 'bg-black/40 backdrop-blur-sm border border-red-500/30 shadow-xl shadow-red-500/30',
      'red-outline': 'border-2 border-red-500/60 bg-transparent backdrop-blur-sm',
      'red-filled': 'bg-gradient-to-br from-red-950/40 to-red-900/40 backdrop-blur-sm border border-red-500/30',
      // Green theme variants
      green: 'bg-black/40 backdrop-blur-sm border border-green-500/30',
      'green-elevated': 'bg-black/40 backdrop-blur-sm border border-green-500/30 shadow-xl shadow-green-500/30',
      'green-outline': 'border-2 border-green-500/60 bg-transparent backdrop-blur-sm',
      'green-filled': 'bg-gradient-to-br from-green-950/40 to-emerald-950/40 backdrop-blur-sm border border-green-500/30',
      // Blue theme variants
      blue: 'bg-black/40 backdrop-blur-sm border border-blue-500/30',
      'blue-elevated': 'bg-black/40 backdrop-blur-sm border border-blue-500/30 shadow-xl shadow-blue-500/30',
      'blue-outline': 'border-2 border-blue-500/60 bg-transparent backdrop-blur-sm',
      'blue-filled': 'bg-gradient-to-br from-blue-950/40 to-cyan-950/40 backdrop-blur-sm border border-blue-500/30',
      // Sage theme variants
      sage: 'bg-black/40 backdrop-blur-sm border border-green-600/30',
      'sage-elevated': 'bg-black/40 backdrop-blur-sm border border-green-600/30 shadow-xl shadow-green-600/30',
      'sage-outline': 'border-2 border-green-600/60 bg-transparent backdrop-blur-sm',
      'sage-filled': 'bg-gradient-to-br from-green-900/40 to-teal-900/40 backdrop-blur-sm border border-green-600/30',
      // Orange theme variants
      orange: 'bg-black/40 backdrop-blur-sm border border-orange-500/30',
      'orange-elevated': 'bg-black/40 backdrop-blur-sm border border-orange-500/30 shadow-xl shadow-orange-500/30',
      'orange-outline': 'border-2 border-orange-500/60 bg-transparent backdrop-blur-sm',
      'orange-filled': 'bg-gradient-to-br from-orange-950/40 to-red-950/40 backdrop-blur-sm border border-orange-500/30',
    };

    const sizeClasses = {
      default: 'p-0',
      sm: 'p-4',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={twMerge(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

const CardHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
);

const CardTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={twMerge(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
);

const CardDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={twMerge('text-sm text-muted-foreground', className)}
    {...props}
  />
);

const CardContent = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('p-6 pt-0', className)} {...props} />
);

const CardFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge('flex items-center p-6 pt-0', className)}
    {...props}
  />
);

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
};

