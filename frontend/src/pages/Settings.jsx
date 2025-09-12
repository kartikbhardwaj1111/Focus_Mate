import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiClock, FiCheckSquare, FiBarChart2, FiUsers, FiSettings, FiLogOut, FiUpload } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || '/api';
const CLOUDINARY_API = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || 'profile_pictures';
const CLOUDINARY_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || 'ProfilePictures';

const SETTINGS_KEY = 'focusmate_settings_v1';
const PROFILE_KEY = 'focusmate_profile_v1';

const focusOptions = [25, 30, 45, 60];
const breakOptions = [5, 10, 15];

const readJSON = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};
const writeJSON = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

const Sidebar = () => (
  <aside className="hidden w-64 shrink-0 bg-gray-800/50 backdrop-blur border-r border-gray-700 text-gray-300 lg:block">
    <div className="flex h-full flex-col">
      <div className="p-6 border-b border-gray-700">
        <Link to="/" className="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors">FocusMate</Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-2">
          <li>
            <Link to="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white">
              <FiHome className="h-5 w-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/timer" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white">
              <FiClock className="h-5 w-5" />
              <span className="text-sm font-medium">Timer</span>
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white">
              <FiCheckSquare className="h-5 w-5" />
              <span className="text-sm font-medium">Tasks</span>
            </Link>
          </li>
          <li>
            <Link to="/analytics" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white">
              <FiBarChart2 className="h-5 w-5" />
              <span className="text-sm font-medium">Analytics</span>
            </Link>
          </li>
          <li>
            <Link to="/team-room" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white">
              <FiUsers className="h-5 w-5" />
              <span className="text-sm font-medium">Team</span>
            </Link>
          </li>
        </ul>
        <div className="mt-6 border-t border-gray-800 pt-6">
          <ul className="space-y-2">
            <li>
              <Link to="/settings" aria-current="page" className="flex items-center gap-3 rounded-lg bg-blue-600 px-3 py-2 text-white">
                <FiSettings className="h-5 w-5" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </li>
            <li>
              <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white">
                <FiLogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Exit</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="p-4 text-xs text-gray-600">© {new Date().getFullYear()} FocusMate</div>
    </div>
  </aside>
);

const Settings = () => {
  const { user, login, signup } = useAuth();

  const initialProfile = useMemo(() => readJSON(PROFILE_KEY, {
    name: user?.name || '',
    email: user?.email || '',
    image: ''
  }), [user]);

  const initialSettings = useMemo(() => readJSON(SETTINGS_KEY, {
    focusDefault: 25,
    breakDefault: 5,
    enableSound: true,
  }), []);

  const [name, setName] = useState(initialProfile.name);
  const [email, setEmail] = useState(initialProfile.email);
  const [image, setImage] = useState(initialProfile.image);
  const [focusDefault, setFocusDefault] = useState(initialSettings.focusDefault);
  const [breakDefault, setBreakDefault] = useState(initialSettings.breakDefault);
  const [enableSound, setEnableSound] = useState(initialSettings.enableSound);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    // keep in sync if AuthContext changes mid-session
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/user`, { withCredentials: true });
        if (res.status === 200) {
          const u = res.data;
          console.log("User fetched successfully:", u);
          setName(u.name || '');
          setEmail(u.email || '');
          setImage(u.image || '');
        }
      } catch (err) {
        console.error('Failed to fetch user', err?.response?.data || err.message);
      }
    };
    fetchUser();
  }, [user]);



  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    formData.append("folder", CLOUDINARY_FOLDER);

    try {
      if (!CLOUDINARY_API) throw new Error('Cloudinary URL is not configured');
      const res = await axios.post(CLOUDINARY_API, formData);
      const url = res?.data?.secure_url;
      if (!url) throw new Error('No secure_url returned from Cloudinary');
      setImage(url);
      return url;
    } catch (err) {
      console.error("Image upload failed", err?.response?.data || err.message);
      throw err;
    }
  };

const onImageChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  // show local preview instantly
  const localPreview = URL.createObjectURL(file);
  setImage(localPreview);
  try {
    setUploading(true);
    const url = await handleImageUpload(file);
    // swap preview with final Cloudinary URL
    setImage(url);
    // auto-save to backend with only image field (avoid overwriting name/email if not loaded)
    await axios.put(`${API_URL}/api/user`, { image: url }, { withCredentials: true });
    setSavedAt(new Date());
  } catch (err) {
    console.error("Image upload failed:", err);
  } finally {
    setUploading(false);
    if (localPreview) URL.revokeObjectURL(localPreview);
  }
};




const onSave = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    const payload = { name, email, image };
    // Save to backend and get updated profile back (optional improvement)
    const res = await axios.put(`${API_URL}/api/user`, payload, { withCredentials: true });

    // Optionally persist preferences locally
    writeJSON(PROFILE_KEY, { name, email, image });
    writeJSON(SETTINGS_KEY, { focusDefault, breakDefault, enableSound });

    setSavedAt(new Date());
  } catch (err) {
    console.error("Save failed:", err?.response?.data || err.message);
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-[var(--page-fg)]">
      <div className="bg-blob left" />
      <div className="bg-blob right" />
      <div className="floating-dots" />

      <div className="flex min-h-screen relative z-10">
        <Sidebar />

        <main className="flex min-h-screen flex-1 flex-col p-8 gap-8">
          <header>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-lg text-gray-400">Update your profile, preferences, and defaults</p>
          </header>

          <form onSubmit={onSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile card */}
            <section className="rounded-xl bg-gray-900 p-6 lg:col-span-1">
              <h2 className="text-xl font-semibold text-white mb-4">Profile</h2>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img src={image || 'https://i.pravatar.cc/150?u=placeholder'} alt="Profile" className="h-24 w-24 rounded-full object-cover border border-gray-700" />
                  {uploading && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-blue-300">Uploading…</span>
                  )}
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                  <FiUpload className="h-4 w-4" />
                  <span>{uploading ? 'Uploading…' : 'Upload Image'}</span>
                  <input type="file" accept="image/*" onChange={onImageChange} className="hidden" disabled={uploading} />
                </label>
              </div>
              <div className="mt-6 space-y-3">
                <div>
                  <label className="block text-sm text-gray-400">Name</label>
                  <input className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 p-2.5 text-white outline-none focus:border-blue-500" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Email</label>
                  <input type="email" className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 p-2.5 text-white outline-none focus:border-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section className="rounded-xl bg-gray-900 p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-4">Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400">Default Focus Duration</label>
                  <select className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 p-2.5 text-white outline-none focus:border-blue-500" value={focusDefault} onChange={(e) => setFocusDefault(parseInt(e.target.value, 10))}>
                    {focusOptions.map((m) => (
                      <option key={m} value={m}>{m} minutes</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Default Break Duration</label>
                  <select className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 p-2.5 text-white outline-none focus:border-blue-500" value={breakDefault} onChange={(e) => setBreakDefault(parseInt(e.target.value, 10))}>
                    {breakOptions.map((m) => (
                      <option key={m} value={m}>{m} minutes</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input id="sound" type="checkbox" className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500" checked={enableSound} onChange={(e) => setEnableSound(e.target.checked)} />
                  <label htmlFor="sound" className="text-sm text-gray-300">Enable Sounds</label>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button type="submit" disabled={saving} className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-60">{saving ? 'Saving...' : 'Save Settings'}</button>
                {savedAt && (
                  <span className="text-xs text-gray-400">Saved {savedAt.toLocaleTimeString()}</span>
                )}
              </div>
            </section>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Settings;