import React, { useState } from "react";
import { twMerge } from 'tailwind-merge';

// Accordion Trigger Props
type AccordionTriggerProps = {
  children: React.ReactNode;
  onClick: () => void;
  isOpen: boolean;
};

// Accordion Content Props
type AccordionContentProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

// Accordion Trigger Component
export const AccordionTrigger = ({
  children,
  onClick,
  isOpen,
}: AccordionTriggerProps) => {
  const triggerClass = twMerge(
    "flex justify-between items-center cursor-pointer p-4 bg-black/20 rounded-t-lg hover:bg-black/40 dark:bg-black/60 dark:hover:bg-black/40 hover:shadow-lg hover:shadow-blue-500/25 hover:shadow-cyan-400/20 transition-all duration-300 text-white font-orbitron border border-white/10 backdrop-blur-sm animate-hologram",
    isOpen ? "" : "rounded-b-lg"
  );

  return (
    <div
      className={triggerClass}
      onClick={onClick}
    >
      {children}
      <span className="transform transition-transform duration-200">
        {isOpen ? "▲" : "▼"}
      </span>
    </div>
  );
};

// Accordion Content Component
export const AccordionContent = ({
  children,
  isOpen,
}: AccordionContentProps) => {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "max-h-96" : "max-h-0"
        }`}
    >
      <div className={`p-4 bg-black/40 dark:bg-black/60 rounded-b-lg backdrop-blur-sm border-t border-white/10 transition-all duration-300 ease-out delay-100 transform ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}>
        {children}
      </div>
    </div>
  );
};

// Main Accordion Component
type AccordionProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
};

export const Accordion = ({ trigger, children }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-2">
      <AccordionTrigger onClick={toggleAccordion} isOpen={isOpen}>
        {trigger}
      </AccordionTrigger>
      <AccordionContent isOpen={isOpen}>{children}</AccordionContent>
    </div>
  );
};
