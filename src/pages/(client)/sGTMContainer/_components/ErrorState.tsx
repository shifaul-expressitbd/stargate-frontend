import { Button } from '@/components/shared/buttons/button';
import { motion } from 'motion/react';
import { FaServer } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
    refetch: () => void;
}

export const ErrorState = ({ refetch }: ErrorStateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64"
        >
            <div className="text-center text-red-400">
                <FaServer className="mx-auto text-4xl mb-4" />
                <p className="text-lg font-semibold">Error Loading Container</p>
                <p className="text-sm mb-4">The requested container could not be loaded</p>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={refetch}
                        title="Retry loading container"
                        className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                    >
                        Try Again
                    </Button>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 bg-cyan-400 text-black rounded-md hover:bg-cyan-300 transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};