import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import axios from 'axios';
import GoogleLoginButton from '../components/GoogleLoginButton.jsx';
const API_URL = import.meta.env.VITE_API_URL || '/api'; // Vite proxy to http://localhost:3000 in dev

// Simple animation variants for staggered form fields
const formContainer = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut', staggerChildren: 0.06 },
  },
};

const formItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const AuthJoin = () => {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    remember: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    if (tab === 'signup') {
      if (!form.name.trim()) return 'Name is required.';
    }
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return 'Enter a valid email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (tab === 'signup' && form.password !== form.confirm) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      if (tab === 'login') {
        const res = await axios.post(
          `${API_URL}/auth/login`,
          {
            email: form.email,
            password: form.password,
          },
          {
            withCredentials: true,
            timeout: 15000,
          }
        );
        if (res.status === 200) {
          navigate('/dashboard', { replace: true });
        }
      } else {
        const res = await axios.post(
          `${API_URL}/auth/register`,
          {
            email: form.email,
            password: form.password,
            name: form.name,
          },
          {
            withCredentials: true,
            timeout: 15000,
          }
        );
        if (res.status === 201) {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const activeIsLogin = tab === 'login';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      {/* Subtle animated background orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(183,118,255,0.22),transparent_60%)] blur-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(107,140,255,0.18),transparent_60%)] blur-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      />

      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mx-auto mt-10 w-full max-w-xl px-6"
      >
        {/* Auth card */}
        <motion.div
          className="rounded-3xl border border-white/10 bg-[#0f1113]/90 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Tabs */}
          <div className="flex flex-col items-center text-center">
            <div className="relative inline-flex items-center rounded-full bg-white/5 p-1">
              <button
                onClick={() => setTab('login')}
                className={`relative z-10 rounded-full px-6 py-2.5 text-base font-medium transition-colors ${
                  activeIsLogin ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setTab('signup')}
                className={`relative z-10 rounded-full px-6 py-2.5 text-base font-medium transition-colors ${
                  !activeIsLogin ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                Signup
              </button>
              <motion.span
                layout
                className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-white/10"
                animate={{ left: activeIsLogin ? 4 : 'calc(50% + 4px)' }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            </div>

            <motion.h1
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-2xl font-semibold tracking-tight"
            >
              {activeIsLogin ? 'Welcome back' : 'Create your account'}
            </motion.h1>
            <motion.p
              key={`${tab}-sub`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="mt-1 text-sm text-white/70"
            >
              {activeIsLogin ? 'Log in to continue to your dashboard' : 'Join to start focusing with your team'}
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            variants={formContainer}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <AnimatePresence mode="popLayout">
              {tab === 'signup' && (
                <motion.div
                  key="name"
                  layout
                  variants={formItem}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <label className="mb-1.5 block text-sm text-white/80">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-4 py-3.5 text-base outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/10"
                    placeholder="Your name"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={formItem}>
              <label className="mb-1.5 block text-sm text-white/80">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-4 py-3.5 text-base outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/10"
                placeholder="you@example.com"
              />
            </motion.div>

            <motion.div variants={formItem}>
              <label className="mb-1.5 block text-sm text-white/80">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-4 py-3.5 text-base outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/10"
                placeholder="••••••••"
              />
            </motion.div>

            <AnimatePresence mode="popLayout">
              {tab === 'signup' && (
                <motion.div
                  key="confirm"
                  layout
                  variants={formItem}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <label className="mb-1.5 block text-sm text-white/80">Confirm Password</label>
                  <input
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={onChange}
                    className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-4 py-3.5 text-base outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/10"
                    placeholder="••••••••"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {tab === 'login' && (
                <motion.label
                  key="remember"
                  layout
                  variants={formItem}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 text-sm text-white/75"
                >
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={onChange}
                    className="h-4 w-4 rounded border-white/25 bg-[#0b0b0d]"
                  />
                  Remember me
                </motion.label>
              )}
            </AnimatePresence>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.015, boxShadow: '0 0 36px rgba(183,118,255,0.35)' }}
              whileTap={{ scale: 0.985 }}
              disabled={loading}
              type="submit"
              className="mt-1.5 w-full rounded-2xl bg-[linear-gradient(90deg,#6B8CFF_0%,#B776FF_100%)] px-5 py-3.5 text-base font-semibold text-white transition disabled:opacity-60"
            >
              {loading ? 'Please wait…' : activeIsLogin ? 'Login' : 'Create account'}
            </motion.button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0f1113]/90 px-2 text-xs text-white/50">or continue with</span>
              </div>
            </div>

            {/* Google Sign-In */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-1"
              >
                <div className="rounded-2xl bg-[#0f1113]/80 p-3">
                  <GoogleLoginButton
                    onSuccess={() => navigate('/dashboard', { replace: true })}
                    onError={(msg) => setError(msg)}
                  />
                </div>
              </motion.div>
            </div>
          </motion.form>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default AuthJoin;