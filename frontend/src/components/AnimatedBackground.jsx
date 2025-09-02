import React from 'react';
import { motion } from 'framer-motion';

// Reusable animated background with floating gradient blobs
const AnimatedBackground = () => {
  const float = {
    animate: {
      y: [0, -12, 0],
      x: [0, 8, 0],
      scale: [1, 1.04, 1],
      rotate: [0, 8, 0],
      transition: {
        duration: 10,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Top-left orb */}
      <motion.div
        variants={float}
        animate="animate"
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(183,118,255,0.22),transparent_60%)] blur-2xl"
      />
      {/* Bottom-right orb */}
      <motion.div
        variants={float}
        animate="animate"
        transition={{ delay: 1.2, duration: 11, repeat: Infinity }}
        className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(107,140,255,0.18),transparent_60%)] blur-2xl"
      />
      {/* Center glow */}
      <motion.div
        variants={float}
        animate="animate"
        transition={{ delay: 0.6, duration: 12, repeat: Infinity }}
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)] blur-3xl"
      />
    </div>
  );
};

export default AnimatedBackground;