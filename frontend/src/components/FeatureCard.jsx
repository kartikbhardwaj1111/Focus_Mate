import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, desc, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.5 }}
      className="card-hover h-full rounded-2xl border border-white/5 bg-[#0f1113] p-6"
    >
      <div className="mb-4 text-white/90">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[#bdbdbf]">{desc}</p>
    </motion.div>
  );
};

export default FeatureCard;