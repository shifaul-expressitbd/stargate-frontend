import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export type OTPInputVariant = 'default' | 'cosmic';

interface OTPInputProps {
  length?: number;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  error?: string;
  success?: boolean;
  className?: string;
  variant?: OTPInputVariant;
}

const OTPInput = ({ length = 6, onChange, onComplete, success, error, className, variant = 'default' }: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle OTP change
  const handleChange = (index: number, value: string) => {
    if (/\D/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Trigger onChange callback
    onChange(newOtp.join(""));

    // Check if all digits are filled (only call onComplete if we have exactly 'length' digits)
    const otpString = newOtp.join("");
    if (otpString.length === length && /^\d{6}$/.test(otpString) && onComplete) {
      onComplete(otpString);
    }

    // Auto-focus to the next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    const newOtp = [...otp];

    pasteData.split("").forEach((char, i) => {
      if (/\d/.test(char)) {
        newOtp[i] = char;
      }
    });

    setOtp(newOtp);
    const otpString = newOtp.join("");
    onChange(otpString);

    // Only call onComplete if we have exactly 'length' digits
    if (otpString.length === length && /^\d{6}$/.test(otpString) && onComplete) {
      onComplete(otpString);
    }
  };

  // Focus the first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className={`space-y-1 text-center ${className}`}>
      <div className='flex items-center justify-between gap-2'>
        {otp.map((digit, index) => (
          <input
            key={index}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            aria-label={`OTP digit ${index + 1}`}
            className={twMerge(
              'size-1 w-12 min-w-4 h-12 min-h-4 rounded-lg border text-center',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              error
                ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-500/30'
                : success
                  ? variant === 'cosmic'
                    ? 'border-cyan-400/70 focus:ring-cyan-200/50 dark:focus:ring-cyan-300/30'
                    : 'border-green-500 focus:ring-green-200 dark:focus:ring-green-500/30'
                  : variant === 'cosmic'
                    ? 'bg-gray-900/80 border-cyan-400/50 hover:border-cyan-300 dark:hover:border-cyan-200 dark:bg-slate-900 dark:border-cyan-500/50'
                    + ' focus:ring-cyan-200/50 dark:focus:ring-cyan-300/30'
                    + ' placeholder-cyan-300/50 dark:placeholder-cyan-400/70'
                    : 'bg-white dark:bg-black border-gray-300 dark:border-gray-600 focus:ring-orange-200 dark:focus:ring-primary',
              variant === 'cosmic'
                ? 'text-cyan-100 dark:text-cyan-100'
                : 'text-gray-900 dark:text-gray-100'
            )}
          />
        ))}
      </div>
      <div className='min-h-5'>{error && <p className='text-accent text-sm'>{error}</p>}</div>
    </div>
  );
};

export default OTPInput;
