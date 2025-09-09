import React, { useState } from "react";
import { twMerge } from 'tailwind-merge';

// Accordion Trigger Props
type AccordionTriggerProps = {
  children: React.ReactNode;
  onClick: () => void;
  isOpen: boolean;
};

// New CollapsibleTrigger Props with title and date support
type CollapsibleTriggerProps = {
  title: string;
  date?: string;
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
    "flex justify-between items-center cursor-pointer p-4 bg-black/20 rounded-t-lg hover:bg-black/40 dark:bg-black/60 dark:hover:bg-black/40 hover:shadow-lg hover:shadow-blue-500/25 hover:shadow-cyan-400/20 transition-all duration-300 text-white font-poppins border border-white/10 backdrop-blur-sm animate-hologram",
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

// Collapsible Trigger Component (compatible with Collapsible API)
export const CollapsibleTrigger = ({
  title,
  date,
  onClick,
  isOpen,
}: CollapsibleTriggerProps) => {
  const triggerClass = twMerge(
    "flex justify-between items-center cursor-pointer p-4 bg-black/20 rounded-t-lg hover:bg-black/40 dark:bg-black/60 dark:hover:bg-black/40 hover:shadow-lg hover:shadow-blue-500/25 hover:shadow-cyan-400/20 transition-all duration-300 text-white font-poppins border border-white/10 backdrop-blur-sm animate-hologram",
    isOpen ? "" : "rounded-b-lg"
  );

  return (
    <div
      className={triggerClass}
      onClick={onClick}
    >
      <div className="flex items-center justify-between flex-1">
        <h4 className="font-medium">{title}</h4>
        {date && <span className="text-muted-foreground text-xs">{date}</span>}
      </div>
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

// Collapsible Component (compatible with original Collapsible API, now supports controlled state)
export const Collapsible = ({
  title,
  date,
  children,
  defaultOpen = false,
  className = '',
  isOpen: controlledIsOpen,
  onToggle
}: {
  title: string;
  date?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const isControlled = controlledIsOpen !== undefined;
  const currentIsOpen = isControlled ? controlledIsOpen : isOpen;

  const toggleOpen = () => {
    if (onToggle) {
      onToggle();
    } else if (!isControlled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`rounded-lg border ${className}`}>
      <CollapsibleTrigger
        title={title}
        date={date}
        onClick={toggleOpen}
        isOpen={currentIsOpen}
      />
      <AccordionContent isOpen={currentIsOpen}>
        {children}
      </AccordionContent>
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

