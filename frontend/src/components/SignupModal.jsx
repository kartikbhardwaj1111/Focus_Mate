import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiUser, FiMail, FiLock, FiX } from 'react-icons/fi';

// Props:
// - isOpen: boolean
// - onClose: () => void
// - onSubmit: (data: { fullName: string; email: string; password: string }) => void | Promise<void>
// - onSignIn?: () => void
const SignupModal = ({ isOpen, onClose, onSubmit, onSignIn }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);
  const previouslyFocused = useRef(null);

  const isValidEmail = (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);

  const validate = useMemo(
    () => () => {
      const e = {};
      if (!fullName.trim()) e.fullName = 'Full name is required.';
      if (!isValidEmail(email)) e.email = 'Enter a valid email address.';
      if (password.length < 6) e.password = 'Minimum 6 characters.';
      return e;
    },
    [fullName, email, password]
  );

  // Lock body scroll and manage focus when modal opens
  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => {
        firstFieldRef.current?.focus();
      }, 0);
      return () => {
        clearTimeout(t);
      };
    }
    return undefined;
  }, [isOpen]);

  // Restore body scroll and focus on close
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      previouslyFocused.current && previouslyFocused.current.focus?.();
    }
  }, [isOpen]);

  // Keyboard handlers: Escape to close, Tab to trap focus within dialog
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    try {
      setSubmitting(true);
      await onSubmit?.({ fullName, email, password });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
      aria-hidden={false}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-modal-title"
        aria-describedby="signup-modal-subtitle"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6 sm:p-8 shadow-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close signup modal"
          className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <FiX className="h-5 w-5" />
        </button>

        {/* Header */}
        <header className="mb-6 sm:mb-8 pr-12">
          <h2
            id="signup-modal-title"
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-purple-600 bg-clip-text text-transparent"
          >
            Join FocusMate
          </h2>
          <p id="signup-modal-subtitle" className="mt-2 text-lg text-gray-400">
            Start your productivity journey today
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="mb-6">
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-white">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                ref={firstFieldRef}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                className="w-full rounded-lg bg-gray-800/50 border border-gray-700 px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            {errors.fullName && (
              <p id="fullName-error" className="mt-2 text-sm text-red-400">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
              Email
            </label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="w-full rounded-lg bg-gray-800/50 border border-gray-700 px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-white">
              Password
            </label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className="w-full rounded-lg bg-gray-800/50 border border-gray-700 px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            {errors.password && (
              <p id="password-error" className="mt-2 text-sm text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          {/* Primary Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 py-3 px-6 text-lg font-semibold text-white transition-all duration-200 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        {/* Secondary Action */}
        <div className="mt-6 text-center">
          <span className="text-gray-400">Already have an account? </span>
          <button
            type="button"
            onClick={onSignIn}
            className="align-middle text-blue-400 border border-blue-400 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            Sign in
          </button>
        </div>

        {/* Demo notice */}
        <div className="mt-6 rounded-lg border border-orange-700 bg-orange-900/30 p-3 text-orange-300 text-sm">
          🤖 This is a demo interface - no actual authentication required!
        </div>
      </div>
    </div>
  );
};

export default SignupModal;