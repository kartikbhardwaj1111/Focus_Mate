import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();


  // Notification state
  const [permission, setPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return;
    try {
      const p = await Notification.requestPermission();
      setPermission(p);
      if (p === 'granted') {
        // Play a short chime to confirm (via WebAudio)
        try {
          const Ctx = window.AudioContext || window.webkitAudioContext;
          const ctx = new Ctx();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine'; o.frequency.value = 1000; o.connect(g); g.connect(ctx.destination);
          g.gain.setValueAtTime(0.0001, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
          o.start(); o.stop(ctx.currentTime + 0.15);
        } catch (_) {}
        new Notification('Notifications enabled', { body: 'You will get timer alerts.' });
      }
    } catch (_) {}
  };

  return (
    <nav className="z-10 relative flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-6 md:py-7 bg-transparent">
      <Link to="/" className="flex items-center gap-3 select-none">
        <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="gradient-text">Focus</span>
          <span className="text-[var(--page-fg)]">Mate</span>
        </span>
      </Link>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={requestPermission}
          aria-label="Enable notifications"
          className="flex items-center gap-2 rounded-full px-5 py-2.5 md:px-6 md:py-3 border border-white/10 bg-[var(--panel-bg)] text-sm md:text-base font-medium hover:border-white/20 text-[var(--page-fg)]"
        >
          <Bell size={18} />
          <span className="hidden sm:block">{permission === 'granted' ? 'Notifications On' : 'Enable Notifications'}</span>
        </motion.button>

        {/* Join */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 22px rgba(107,140,255,0.25)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (location.pathname !== '/join') navigate('/join');
          }}
          className="rounded-full px-6 py-2.5 md:px-7 md:py-3 border border-white/10 bg-[var(--panel-bg)] text-sm md:text-base font-medium hover:border-white/20 text-[var(--page-fg)]"
        >
          Join
        </motion.button>

        {/* audio element for chimes */}
        <audio ref={audioRef} preload="auto">
          <source src="/sounds/chime.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </nav>
  );
};

export default Navbar;