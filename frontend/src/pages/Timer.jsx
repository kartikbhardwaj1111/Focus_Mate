import React, { useEffect, useState } from 'react';
import { notify } from '../utils/notify';
import { FiPlay, FiPause, FiRotateCcw, FiRefreshCw } from 'react-icons/fi';
import SidebarNav from '../components/SidebarNav.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Presets (in minutes)
const FOCUS_PRESETS = [25, 30, 45, 60];
const BREAK_PRESETS = [5, 10, 15];

const STORAGE_KEY = 'focusmate_timer_state_v1';

const Timer = () => {
  // Selected durations (minutes) - initialize from Settings if present
  const [focusMinutes, setFocusMinutes] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('focusmate_settings_v1'));
      return Number(s.timeLeft) || 25;
    } catch { return 25; }
  });
  const [breakMinutes, setBreakMinutes] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('focusmate_settings_v1'));
      return Number(s.breakDefault) || 5;
    } catch { return 5; }
  });

  // Core timer state
  const [timeLeft, setTimeLeft] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('focusmate_settings_v1'));
      return (Number(s.timeLeft) || 25) * 60;
    } catch { return 25 * 60; }
  }); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'

  // Stats
  const [sessionsToday, setSessionsToday] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0); // minutes
  const [currentStreak, setCurrentStreak] = useState(0);

// Load persisted state
useEffect(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (typeof saved.focusMinutes === 'number') setFocusMinutes(saved.focusMinutes);
      if (typeof saved.breakMinutes === 'number') setBreakMinutes(saved.breakMinutes);
      if (typeof saved.timeLeft === 'number') setTimeLeft(saved.timeLeft);
      else setTimeLeft((saved.mode === 'break' ? (saved.breakMinutes || 5) : (saved.focusMinutes || 25)) * 60);
      if (typeof saved.isRunning === 'boolean') setIsRunning(saved.isRunning);
      if (saved.mode === 'focus' || saved.mode === 'break') setMode(saved.mode);
      if (typeof saved.sessionsToday === 'number') setSessionsToday(saved.sessionsToday);
      if (typeof saved.totalFocusTime === 'number') setTotalFocusTime(saved.totalFocusTime);
      if (typeof saved.currentStreak === 'number') setCurrentStreak(saved.currentStreak);
    }
  } catch (_) {
    // ignore parse errors; start fresh
  }
}, []);

// Persist state
useEffect(() => {
  const payload = {
    focusMinutes,
    breakMinutes,
    timeLeft,
    isRunning,
    mode,
    sessionsToday,
    totalFocusTime,
    currentStreak,
    endTime: isRunning ? Date.now() + timeLeft * 1000 : null, // 🔑 save absolute end time
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}, [focusMinutes, breakMinutes, timeLeft, isRunning, mode, sessionsToday, totalFocusTime, currentStreak]);


// Load persisted state with endTime check
useEffect(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const saved = JSON.parse(raw);

    if (typeof saved.focusMinutes === 'number') setFocusMinutes(saved.focusMinutes);
    if (typeof saved.breakMinutes === 'number') setBreakMinutes(saved.breakMinutes);
    if (saved.mode === 'focus' || saved.mode === 'break') setMode(saved.mode);
    if (typeof saved.sessionsToday === 'number') setSessionsToday(saved.sessionsToday);
    if (typeof saved.totalFocusTime === 'number') setTotalFocusTime(saved.totalFocusTime);
    if (typeof saved.currentStreak === 'number') setCurrentStreak(saved.currentStreak);

    // 🔑 Recalculate timeLeft
    if (saved.isRunning && saved.endTime) {
      const diff = Math.floor((saved.endTime - Date.now()) / 1000);
      if (diff > 0) {
        setTimeLeft(diff);
        setIsRunning(true);
      } else {
        // Session expired while away
        if (saved.mode === 'focus') {
          setSessionsToday((p) => p + 1);
          setTotalFocusTime((p) => p + saved.focusMinutes);
          setMode('break');
          setTimeLeft(saved.breakMinutes * 60);
        } else {
          setMode('focus');
          setTimeLeft(saved.focusMinutes * 60);
        }
        setIsRunning(false);
      }
    } else {
      // Not running → reset to full duration
      setTimeLeft((saved.mode === 'break' ? saved.breakMinutes : saved.focusMinutes) * 60);
      setIsRunning(false);
    }
  } catch (_) {
    // ignore parse errors
  }
}, []);


// Countdown ticking effect
useEffect(() => {
  if (!isRunning) return;

  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev > 1) return prev - 1;

      // 🔔 Time's up: switch mode
      if (mode === "focus") {
        setSessionsToday((p) => p + 1);
        setTotalFocusTime((p) => p + focusMinutes);
        setMode("break");
        notify("Break time!", `Take ${breakMinutes} minutes to rest.`, { sound: true });
        return breakMinutes * 60;
      } else {
        setMode("focus");
        notify("Focus time!", `Stay focused for ${focusMinutes} minutes.`, { sound: true });
        return focusMinutes * 60;
      }
    });
    return 0; // failsafe
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning, mode, focusMinutes, breakMinutes]);



  // Format time MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning((r) => {
      const next = !r;
      if (next) {
        notify(
          mode === 'focus' ? 'Focus started' : 'Break started',
          mode === 'focus'
            ? `Stay focused for ${focusMinutes} minutes.`
            : `Relax for ${breakMinutes} minutes.`,
          { sound: true }
        );
      }
      return next;
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft((mode === 'focus' ? focusMinutes : breakMinutes) * 60);
  };

  const handleSwitchMode = () => {
    const next = mode === 'focus' ? 'break' : 'focus';
    setMode(next);
    setIsRunning(false);
    setTimeLeft((next === 'focus' ? focusMinutes : breakMinutes) * 60);
    notify(next === 'focus' ? 'Focus mode' : 'Break mode', undefined, { sound: true });
  };

  // When user changes presets: if not running, snap remaining time to new preset for current mode
  const changeFocus = (m) => {
    setFocusMinutes(m);
    if (!isRunning && mode === 'focus') setTimeLeft(m * 60);
  };
  const changeBreak = (m) => {
    setBreakMinutes(m);
    if (!isRunning && mode === 'break') setTimeLeft(m * 60);
  };

  const presetBtn = (label, active) =>
    [
      'rounded-md px-3 py-1.5 text-sm transition-colors',
      active
        ? 'bg-blue-600 text-white'
        : 'border border-gray-600 text-gray-300 hover:bg-gray-800',
    ].join(' ');

  const [stats, setStats] = useState([
    {
      id: 'total-time',
      value: '0'
    },
    {
      id: 'completed-sessions',
      value: '0'
    },
    {
      id: 'tasks-completed',
      value: '0'
    },
    {
      id: 'current-streak',
      value: '0'
    },
  ]);

  useEffect(() => {
    const fetchStats = async() => {
        const res = await axios.get(`${API_URL}/stats`,{
          withCredentials: true
        })
        const data = res.data; 
        if(res.status === 200){
          setStats((prev) =>  prev.map((stat) => {
            if (stat.id === 'total-time') {
              const v = data?.totalFocusTime ?? 0;
              return { ...stat, value: `${v}` };
            }
            if (stat.id === 'completed-sessions') {
              const v = data?.completedSessions ?? 0;
              return { ...stat, value: v.toString() };
            }
            if (stat.id === 'tasks-completed') {
              const v = data?.tasksCompleted ?? 0;
              return { ...stat, value: v.toString() };
            }
            if (stat.id === 'current-streak') {
              const v = data?.currentStreak ?? 0;
              return { ...stat, value: v.toString() };
            }
            return stat;
          })
        );
        }
    }
    fetchStats();
  },[]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-[var(--page-fg)]">
      {/* Background elements */}
      <div className="bg-blob left" />
      <div className="bg-blob right" />
      <div className="floating-dots" />
      
      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <SidebarNav />

        {/* Main timer interface */}
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Large timer */}
            <div className="text-8xl font-mono font-bold text-blue-400">{formatTime(timeLeft)}</div>

            {/* Status */}
            <div className="flex items-center justify-center gap-2 text-center text-gray-400">
              <span className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                isRunning ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'
              }`} />
              <span>{mode === 'focus' ? 'Focus Session' : 'Break Time'}</span>
              <span className="text-xs text-gray-500">
                {isRunning ? '(Running)' : '(Stopped)'}
              </span>
            </div>

            {/* Preset selectors */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2 justify-center">
                <span className="text-sm text-gray-400">Focus:</span>
                {FOCUS_PRESETS.map((m) => (
                  <button
                    key={m}
                    onClick={() => changeFocus(m)}
                    className={presetBtn(`${m}m`, focusMinutes === m)}
                    aria-pressed={focusMinutes === m}
                  >
                    {m}m
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className="text-sm text-gray-400">Break:</span>
                {BREAK_PRESETS.map((m) => (
                  <button
                    key={m}
                    onClick={() => changeBreak(m)}
                    className={presetBtn(`${m}m`, breakMinutes === m)}
                    aria-pressed={breakMinutes === m}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {/* Start */}
              <button
                onClick={handleStartPause}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white transition-colors hover:from-blue-600 hover:to-purple-700"
              >
                <span className="inline-flex items-center gap-2">
                  {isRunning ? <FiPause className="h-5 w-5" /> : <FiPlay className="h-5 w-5" />}
                  <span>{isRunning ? 'Pause' : 'Start'}</span>
                </span>
              </button>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="rounded-lg border border-gray-600 px-6 py-3 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <FiRotateCcw className="h-5 w-5" />
                  <span>Reset</span>
                </span>
              </button>

              {/* Switch to Break/Focus */}
              <button
                onClick={handleSwitchMode}
                className="rounded-lg border border-gray-600 px-6 py-3 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <FiRefreshCw className="h-5 w-5" />
                  <span>{mode === 'focus' ? 'Switch to Break' : 'Switch to Focus'}</span>
                </span>
              </button>
            </div>

            {/* Bottom stats */}
            <div className="grid grid-cols-3 gap-8">
              {/* Sessions Today */}
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white">{sessionsToday}</div>
                <div className="text-sm text-gray-400">Sessions Today</div>
              </div>

              {/* Focus Time */}
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-green-400">{stats && stats.find((s) => s.id === "total-time")?.value}m</div>
                <div className="text-sm text-gray-400">Focus Time</div>
              </div>

              {/* Current Streak */}
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-orange-400">{stats && stats.find((s) => s.id === "current-streak")?.value}</div>
                <div className="text-sm text-gray-400">Current Streak</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Timer;