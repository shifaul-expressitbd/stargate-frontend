import { motion } from "motion/react";

const WavyBackground = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: 'radial-gradient(circle at center, var(--color-accent) 0%, var(--color-primary) 20%, var(--color-base) 100%)' }}>
      {/* Wavy Abstract Pattern */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-20"
        animate={{ y: [0, 30, 0], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      >
        <svg
          className="absolute bottom-0 w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="var(--color-primary)"
            fillOpacity="0.6"
            d="M0,160C60,200,120,240,180,250C240,260,300,230,360,200C420,170,480,140,540,160C600,180,660,240,720,250C780,260,840,220,900,200C960,180,1020,200,1080,220C1140,240,1200,260,1260,240C1320,220,1380,160,1440,140V320H0Z"
          ></path>
          <path
            fill="var(--color-secondary)"
            fillOpacity="0.4"
            d="M0,240C60,220,120,180,180,160C240,140,300,160,360,200C420,240,480,280,540,270C600,260,660,200,720,170C780,140,840,140,900,160C960,180,1020,220,1080,240C1140,260,1200,260,1260,240C1320,220,1380,180,1440,160V320H0Z"
          ></path>
        </svg>
      </motion.div>
    </div>
  );
};

export default WavyBackground;
