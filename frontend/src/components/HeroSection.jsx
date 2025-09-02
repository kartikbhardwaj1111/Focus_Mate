import React from 'react';
import GradientButton from './GradientButton.jsx';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const textContainer = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const HeroSection = ({ onGetStarted }) => {
  const navigate = useNavigate();
  return (
    <section className="pt-14 pb-16 md:pt-20 md:pb-24 text-center">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={textContainer}
        custom={0}
        className="font-extrabold leading-tight tracking-tight text-6xl md:text-[5rem] lg:text-[6rem]"
      >
        <span className="gradient-text">Focus</span>
        <span className="text-white">Mate</span>
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={textContainer}
        custom={1}
        className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-[#bdbdbf]"
      >
        Stay accountable, beat procrastination, and get more done with calm focus.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-10 flex items-center justify-center gap-4"
      >
        <GradientButton onClick={(onGetStarted)} className="px-8 py-4 text-lg">
          Get Started
        </GradientButton>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/join')}
          className="rounded-xl px-8 py-4 text-lg font-semibold text-white/90 border border-white/15 bg-white/5 hover:bg-white/10 transition-all"
        >
          Explore Features
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;