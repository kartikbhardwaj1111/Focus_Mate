import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
// Theme removed

// Small helper to play a short chime using WebAudio (no file needed)
const playChime = (frequency = 880, duration = 0.12) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = frequency;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    o.start();
    o.stop(ctx.currentTime + duration + 0.02);
  } catch (_) {}
};

const TopControls = () => {

  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return;
    try {
      const p = await Notification.requestPermission();
      setPermission(p);
      if (p === 'granted') {
        playChime(1000, 0.15);
        new Notification('Notifications enabled', { body: 'You will get timer alerts.' });
      }
    } catch (_) {}
  }, []);

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={requestPermission}
        aria-label="Enable notifications"
        className="flex items-center gap-2 rounded-full px-4 py-2 border border-white/10 bg-[#0f1113] text-sm font-medium hover:border-white/20 text-white"
      >
        <Bell size={16} />
        <span className="hidden sm:block">{permission === 'granted' ? 'Notifications On' : 'Enable Notifications'}</span>
      </motion.button>
    </div>
  );
};

export default TopControls;