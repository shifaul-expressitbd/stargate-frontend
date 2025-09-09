import { AnimatePresence, motion } from 'motion/react';
import React, { createContext, useContext, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

// Context for managing accordion behavior
const CollapsibleContext = createContext<{
    openItem: number | null;
    setOpenItem: (id: number | null) => void;
}>({
    openItem: null,
    setOpenItem: () => { },
});

// Props for CollapsibleGroupProvider
interface CollapsibleGroupProviderProps {
    children: React.ReactNode;
    defaultOpenId?: number;
}

// Group provider to enable accordion behavior
export const CollapsibleGroupProvider: React.FC<CollapsibleGroupProviderProps> = ({
    children,
    defaultOpenId = 0,
}) => {
    const [openItem, setOpenItem] = useState<number | null>(defaultOpenId);

    return (
        <CollapsibleContext.Provider value={{ openItem, setOpenItem }}>
            {children}
        </CollapsibleContext.Provider>
    );
};

interface CollapsibleProps {
    title: string;
    date?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
    id?: number; // For accordion behavior
}

export const Collapsible: React.FC<CollapsibleProps> = ({
    title,
    date,
    children,
    defaultOpen = false,
    className = '',
    id
}) => {
    const context = useContext(CollapsibleContext);
    const [localIsOpen, setLocalIsOpen] = useState(defaultOpen);

    const isInGroup = context && Object.keys(context).length > 0 && id !== undefined; // Check if in accordion group properly

    // Use context if available, otherwise use local state
    const isOpen = isInGroup
        ? (context.openItem === id)
        : localIsOpen;

    const toggleOpen = () => {
        if (isInGroup && id !== undefined) {
            context.setOpenItem(context.openItem === id ? null : id);
        } else {
            setLocalIsOpen(!localIsOpen);
        }
    };

    return (
        <div className={`mb-2 ${className}`}>
            <button
                type="button"
                onClick={toggleOpen}
                className={twMerge("flex w-full items-center justify-between rounded-t-lg rounded-b-lg hover:bg-black/40 dark:bg-black/60 dark:hover:bg-black/40 hover:shadow-lg hover:shadow-purple-400/20 transition-all duration-300 text-white font-poppins text-left border border-white/10 backdrop-blur-sm animate-hologram p-4",
                    isOpen && 'rounded-b-none'
                )}
                aria-expanded={isOpen}
            >
                <div className="flex items-center justify-between flex-1">
                    <h4 className="font-medium">{title}</h4>
                    {date && <span className="text-cyan-300 text-xs font-poppins">{date}</span>}
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2"
                >
                    <FaChevronRight className="w-4 h-4 text-cyan-400" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className={twMerge("p-4 bg-black/40 dark:bg-black/60 rounded-b-lg backdrop-blur-sm border border-white/10", isOpen && 'rounded-t-none')}>
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Collapsible;