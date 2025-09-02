import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Loads the Google Identity Services script once
function useGoogleScript() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      setLoaded(true);
      return;
    }
    const id = 'google-identity-script';
    if (document.getElementById(id)) {
      const check = () => {
        if (window.google && window.google.accounts && window.google.accounts.id) setLoaded(true);
      };
      const t = setInterval(() => {
        check();
        if (loaded) clearInterval(t);
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);

  return loaded;
}

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const loaded = useGoogleScript();
  const btnRef = useRef(null);
  const [buttonRendered, setButtonRendered] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loaded || !btnRef.current || buttonRendered || !CLIENT_ID) return;
    if (!(window.google && window.google.accounts && window.google.accounts.id)) return;

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: async (response) => {
        const idToken = response?.credential;
        if (!idToken) return onError?.('Google sign-in failed.');
        try {
          setSubmitting(true);
          const res = await axios.post(
            `${API_URL}/auth/google`,
            { idToken },
            { withCredentials: true, timeout: 15000 }
          );
          if (res.status === 200) {
            onSuccess?.();
          } else {
            onError?.('Unable to sign in with Google.');
          }
        } catch (err) {
          const msg = err?.response?.data?.message || 'Google sign-in failed.';
          onError?.(msg);
        } finally {
          setSubmitting(false);
        }
      },
    });

    // Render the official Google button
    window.google.accounts.id.renderButton(btnRef.current, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: 'continue_with',
      width: 320,
      logo_alignment: 'left',
    });

    setButtonRendered(true);
  }, [loaded, buttonRendered]);

  return (
    <div className="relative flex w-full items-center justify-center">
      {!CLIENT_ID && (
        <p className="text-xs text-red-400">VITE_GOOGLE_CLIENT_ID is not set.</p>
      )}
      <div ref={btnRef} aria-live="polite" className="[&>div]:!w-full [&>div]:!justify-center" />

      {/* Subtle animated overlay on submit */}
      {submitting && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Connecting to Google…
          </div>
        </div>
      )}

      {/* Fallback button while GIS not ready */}
      {(!loaded || !CLIENT_ID) && (
        <button
          disabled
          className="w-full cursor-not-allowed rounded-2xl border border-white/15 bg-transparent px-5 py-3.5 text-sm text-white/70"
        >
          Loading Google Sign-In…
        </button>
      )}
    </div>
  );
};

export default GoogleLoginButton;