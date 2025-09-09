import { motion } from 'motion/react';

interface HeaderProps {
    user: any; // Adjust type as per your user type
}

const Header = ({ user }: HeaderProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <motion.h1
                    className="text-2xl md:text-4xl font-bold text-white animate-hologram font-orbitron text-shadow-white-strong tracking-[0.2em] capitalize"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Welcome to the Infinite Gateway{' '}
                    <span className="text-2xl md:text-3xl text-cyan-300 font-poppins capitalize tracking-normal whitespace-nowrap">
                        {user?.name?.split(' ')[0] || 'Commander'}!
                    </span>
                </motion.h1>
            </div>
            <motion.p
                className="text-lg text-cyan-200 font-poppins text-shadow-cyan-glow animate-energy-pulse leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                Control your multidimensional data flows across infinite realities.
            </motion.p>
        </div>
    );
};

export default Header;