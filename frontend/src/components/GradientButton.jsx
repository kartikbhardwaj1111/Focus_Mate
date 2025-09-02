import React from 'react';
import { motion } from 'framer-motion';

const GradientButton = ({ children, onClick, className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(183,118,255,0.35)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`rounded-xl px-6 py-3 font-semibold text-white bg-[linear-gradient(90deg,#6B8CFF_0%,#B776FF_100%)] ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default GradientButton;