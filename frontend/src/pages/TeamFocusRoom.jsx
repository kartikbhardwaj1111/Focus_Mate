import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarNav from '../components/SidebarNav.jsx';
import { FiUsers, FiTarget, FiCoffee, FiClock, FiZap, FiUserPlus, FiSquare, FiPlay, FiPause } from 'react-icons/fi';

// Helper: format seconds as mm:ss
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Lightweight cross-tab sync using BroadcastChannel with localStorage fallback
const useRoomChannel = (roomKey = 'team-focus-room') => {
  const channelRef = useRef(null);
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel(roomKey);
    } catch (e) {
      channelRef.current = null;
    }
    return () => {
      if (channelRef.current) channelRef.current.close?.();
    };
  }, [roomKey]);

  const onMessage = (handler) => {
    const bc = channelRef.current;
    const storageHandler = (e) => {
      if (e.key === `bc:${roomKey}` && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          handler(data);
        } catch {}
      }
    };
    if (bc) {
      bc.onmessage = (ev) => handler(ev.data);
      return () => {
        bc.onmessage = null;
      };
    }
    window.addEventListener('storage', storageHandler);
    return () => window.removeEventListener('storage', storageHandler);
  };

  const postMessage = (data) => {
    if (channelRef.current) {
      channelRef.current.postMessage(data);
    } else {
      try {
        localStorage.setItem(`bc:${roomKey}`, JSON.stringify(data));
        // Trigger storage event for same-tab listeners too
        localStorage.removeItem(`bc:${roomKey}`);
      } catch {}
    }
  };

  return { onMessage, postMessage };
};

// Enhanced Sidebar component (replaced by shared SidebarNav)
const Sidebar = () => null;

const TeamFocusRoom = () => {
  // State as specified
  const [roomData, setRoomData] = useState({
    roomCode: 'FOCUS-2024',
    activeMembers: 3,
    focusingNow: 2,
    onBreak: 1,
    teamEnergy: 87,
  });

  const [sharedTimer, setSharedTimer] = useState({
    timeLeft: 17 * 60 + 32,
    isRunning: true,
    mode: 'focus', // 'focus' | 'break'
  });

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alex Chen', role: 'Host', avatar: 'AC', status: 'focusing', timeLeft: '28:47', progress: 85, color: 'bg-emerald-500' },
    { id: 2, name: 'Sarah Johnson', role: '', avatar: 'SJ', status: 'break', timeLeft: '21:23', progress: 40, color: 'bg-purple-500' },
    { id: 3, name: 'Mike Davis', role: '', avatar: 'MD', status: 'focusing', timeLeft: '14:52', progress: 55, color: 'bg-blue-500' },
    { id: 4, name: 'You', role: '', avatar: 'YU', status: 'idle', timeLeft: '', progress: 0, color: 'bg-indigo-500' },
  ]);

  const [activities, setActivities] = useState([
    { id: 1, user: 'Alex Chen', action: 'completed a focus session', timestamp: '2 min ago', type: 'completion', color: 'bg-green-500' },
    { id: 2, user: 'Sarah Johnson', action: 'started a break', timestamp: '5 min ago', type: 'break', color: 'bg-orange-500' },
    { id: 3, user: 'Mike Davis', action: 'joined the room', timestamp: '12 min ago', type: 'join', color: 'bg-blue-500' },
    { id: 4, user: 'Alex Chen', action: 'created the room', timestamp: '45 min ago', type: 'create', color: 'bg-purple-500' },
  ]);

  // Keep top stats in sync with member statuses
  useEffect(() => {
    const focusingNow = teamMembers.filter(m => m.status === 'focusing').length;
    const onBreak = teamMembers.filter(m => m.status === 'break').length;
    const activeMembers = teamMembers.length;
    setRoomData(prev => ({ ...prev, focusingNow, onBreak, activeMembers }));
  }, [teamMembers]);

  // Derived timer config
  const focusDuration = 25 * 60;
  const breakDuration = 5 * 60;
  const totalDuration = sharedTimer.mode === 'focus' ? focusDuration : breakDuration;
  const timerProgress = useMemo(() => {
    const remaining = Math.max(0, Math.min(sharedTimer.timeLeft, totalDuration));
    return 1 - remaining / totalDuration;
  }, [sharedTimer.timeLeft, totalDuration]);

  // Real-time channel
  const { onMessage, postMessage } = useRoomChannel(`room:${roomData.roomCode}`);

  // Broadcast minimal events for sync
  const broadcast = (type, payload = {}) => {
    postMessage({ type, payload, ts: Date.now() });
  };

  // Handle incoming messages
  useEffect(() => {
    const off = onMessage((msg) => {
      if (!msg || !msg.type) return;
      switch (msg.type) {
        case 'TIMER_TICK':
          setSharedTimer((prev) => ({ ...prev, ...msg.payload }));
          break;
        case 'TIMER_SET':
          setSharedTimer((prev) => ({ ...prev, ...msg.payload }));
          break;
        case 'MEMBER_UPDATE':
          setTeamMembers((prev) => prev.map((m) => (m.id === msg.payload.id ? { ...m, ...msg.payload.update } : m)));
          break;
        case 'ACTIVITY_ADD':
          setActivities((prev) => [{ id: Date.now(), ...msg.payload }, ...prev].slice(0, 20));
          break;
        case 'ROOM_STATS':
          setRoomData((prev) => ({ ...prev, ...msg.payload }));
          break;
        default:
          break;
      }
    });
    return () => off?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer logic (authoritative only when running)
  useEffect(() => {
    let interval = null;
    if (sharedTimer.isRunning && sharedTimer.timeLeft > 0) {
      interval = setInterval(() => {
        setSharedTimer((prev) => {
          const next = { ...prev, timeLeft: Math.max(0, prev.timeLeft - 1) };
          broadcast('TIMER_TICK', next);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedTimer.isRunning]);

  // Actions
  const joinFocus = () => {
    // Update your card
    setTeamMembers((prev) => {
      const updated = prev.map((m) => (m.name === 'You' ? { ...m, status: 'focusing', progress: 5 } : m));
      return updated;
    });
    broadcast('MEMBER_UPDATE', { id: 4, update: { status: 'focusing' } });

    // Ensure shared timer in focus mode and running
    const payload = { mode: 'focus', isRunning: true, timeLeft: Math.max(1, sharedTimer.timeLeft || focusDuration) };
    setSharedTimer((s) => ({ ...s, ...payload }));
    broadcast('TIMER_SET', payload);

    const act = { user: 'You', action: 'joined the focus session', timestamp: 'just now', type: 'join', color: 'bg-blue-500' };
    setActivities((prev) => [{ id: Date.now(), ...act }, ...prev]);
    broadcast('ACTIVITY_ADD', act);

    // Update top stats
    setRoomData((r) => ({ ...r, focusingNow: r.focusingNow + 1 }));
    broadcast('ROOM_STATS', { focusingNow: roomData.focusingNow + 1 });
  };

  const takeBreak = () => {
    // You switch to break and timer to break mode
    setTeamMembers((prev) => prev.map((m) => (m.name === 'You' ? { ...m, status: 'break' } : m)));
    broadcast('MEMBER_UPDATE', { id: 4, update: { status: 'break' } });

    const payload = { mode: 'break', isRunning: true, timeLeft: breakDuration };
    setSharedTimer((s) => ({ ...s, ...payload }));
    broadcast('TIMER_SET', payload);

    const act = { user: 'You', action: 'started a break', timestamp: 'just now', type: 'break', color: 'bg-orange-500' };
    setActivities((prev) => [{ id: Date.now(), ...act }, ...prev]);
    broadcast('ACTIVITY_ADD', act);

    // Update top stats simply
    setRoomData((r) => ({ ...r, onBreak: r.onBreak + 1 }));
    broadcast('ROOM_STATS', { onBreak: roomData.onBreak + 1 });
  };

  const stopSession = () => {
    // Set user to idle and stop the timer
    setTeamMembers((prev) => prev.map((m) => (m.name === 'You' ? { ...m, status: 'idle', progress: 0, timeLeft: '' } : m)));
    broadcast('MEMBER_UPDATE', { id: 4, update: { status: 'idle', progress: 0, timeLeft: '' } });

    // Stop the shared timer
    const payload = { isRunning: false, timeLeft: sharedTimer.mode === 'focus' ? focusDuration : breakDuration };
    setSharedTimer((s) => ({ ...s, ...payload }));
    broadcast('TIMER_SET', payload);

    // Add activity
    const act = { user: 'You', action: 'stopped the session', timestamp: 'just now', type: 'stop', color: 'bg-red-500' };
    setActivities((prev) => [{ id: Date.now(), ...act }, ...prev]);
    broadcast('ACTIVITY_ADD', act);

    // Update stats - decrease the appropriate counter
    if (sharedTimer.mode === 'focus') {
      setRoomData((r) => ({ ...r, focusingNow: Math.max(0, r.focusingNow - 1) }));
      broadcast('ROOM_STATS', { focusingNow: Math.max(0, roomData.focusingNow - 1) });
    } else {
      setRoomData((r) => ({ ...r, onBreak: Math.max(0, r.onBreak - 1) }));
      broadcast('ROOM_STATS', { onBreak: Math.max(0, roomData.onBreak - 1) });
    }
  };

  const invite = async () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomData.roomCode}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Invite link copied to clipboard!');
    } catch {
      prompt('Copy invite link:', url);
    }
  };

  // SVG circle values for timer
  const size = 280;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - timerProgress);

  // Enhanced StatCard component
  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 hover:bg-gray-800/70 transition-all duration-300 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Enhanced MemberCard component
  const MemberCard = ({ member }) => {
    const statusConfig = {
      focusing: { text: '🎯 Focusing', color: 'text-green-400', bgColor: 'bg-green-900/30', borderColor: 'border-green-500/50' },
      break: { text: '☕ On Break', color: 'text-orange-400', bgColor: 'bg-orange-900/30', borderColor: 'border-orange-500/50' },
      idle: { text: '💤 Idle', color: 'text-gray-400', bgColor: 'bg-gray-800/30', borderColor: 'border-gray-600/50' }
    };

    const config = statusConfig[member.status] || statusConfig.idle;

    return (
      <div className={`bg-gray-800/50 backdrop-blur rounded-xl border-2 ${config.borderColor} p-6 hover:bg-gray-800/70 transition-all duration-300 card-hover`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {member.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{member.name}</h3>
              {member.role && (
                <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                  {member.role}
                </span>
              )}
            </div>
            <p className={`text-sm font-medium ${config.color}`}>{config.text}</p>
          </div>
        </div>

        {member.name !== 'You' ? (
          <>
            {member.timeLeft && (
              <div className="mb-3">
                <p className="text-sm text-gray-300 mb-2">Time remaining: {member.timeLeft}</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      member.status === 'focusing' ? 'bg-green-500' : 
                      member.status === 'break' ? 'bg-orange-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${member.progress}%` }}
                  />
                </div>
              </div>
            )}
          </>
        ) : member.status === 'idle' ? (
          <div className="flex gap-2">
            <button
              onClick={joinFocus}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Join Focus
            </button>
            <button
              onClick={takeBreak}
              className="flex-1 border-2 border-orange-500 text-orange-400 hover:bg-orange-500/10 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Take Break
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${config.bgColor}`}>
              <p className="text-sm font-medium text-gray-300">You're currently {config.text.toLowerCase()}</p>
            </div>
            <button
              onClick={stopSession}
              className="w-full border-2 border-red-500 text-red-400 hover:bg-red-500/10 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <FiSquare className="w-4 h-4" />
              Stop Session
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-[var(--page-fg)]">
      {/* Background elements */}
      <div className="bg-blob left" />
      <div className="bg-blob right" />
      <div className="floating-dots" />
      
      <div className="flex min-h-screen relative z-10">
        <SidebarNav />
        
        <main className="flex-1 overflow-auto">
          {/* Header Section */}
          <div className="bg-gray-800/50 backdrop-blur border-b border-gray-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Team Focus Room</h1>
              <p className="text-gray-300 mt-1">Collaborate and focus together with your team</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Room Code</p>
                <p className="font-mono font-bold text-lg text-white">{roomData.roomCode}</p>
              </div>
              <button
                onClick={invite}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg transition-colors duration-200"
              >
                <FiUserPlus className="w-5 h-5" />
                Invite Members
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={FiUsers} 
              label="Active Members" 
              value={roomData.activeMembers} 
              bgColor="bg-blue-500" 
            />
            <StatCard 
              icon={FiTarget} 
              label="Focusing Now" 
              value={roomData.focusingNow} 
              bgColor="bg-green-500" 
            />
            <StatCard 
              icon={FiCoffee} 
              label="On Break" 
              value={roomData.onBreak} 
              bgColor="bg-orange-500" 
            />
            <StatCard 
              icon={FiZap} 
              label="Team Energy" 
              value={`${roomData.teamEnergy}%`} 
              bgColor="bg-purple-500" 
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Timer Section */}
            <div className="xl:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-8 card-hover">
                <h2 className="text-2xl font-bold text-white text-center mb-8">Shared Timer</h2>
                
                <div className="flex flex-col items-center">
                  {/* Timer Circle */}
                  <div className="relative mb-8" style={{ width: size, height: size }}>
                    <svg width={size} height={size} className="transform -rotate-90">
                      <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#374151"
                        strokeWidth={stroke}
                        fill="none"
                      />
                      <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={sharedTimer.mode === 'focus' ? '#3B82F6' : '#F59E0B'}
                        strokeWidth={stroke}
                        fill="none"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: circumference,
                          strokeDashoffset: dashOffset,
                          transition: 'stroke-dashoffset 0.6s ease',
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold text-white mb-2">
                        {formatTime(sharedTimer.timeLeft)}
                      </div>
                      <div className={`text-sm font-semibold tracking-wider uppercase ${
                        sharedTimer.mode === 'focus' ? 'text-blue-400' : 'text-orange-400'
                      }`}>
                        {sharedTimer.mode === 'focus' ? 'Focus Session' : 'Break Time'}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {sharedTimer.isRunning ? (
                          <FiPlay className="w-4 h-4 text-green-400" />
                        ) : (
                          <FiPause className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-400">
                          {sharedTimer.isRunning ? 'Running' : 'Paused'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={joinFocus}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                    >
                      <FiClock className="w-5 h-5" />
                      Join Focus Session
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={takeBreak}
                        className="flex-1 border-2 border-orange-500 text-orange-400 hover:bg-orange-500/10 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                      >
                        <FiCoffee className="w-4 h-4" />
                        Take Break
                      </button>
                      <button
                        onClick={stopSession}
                        className="flex-1 border-2 border-red-500 text-red-400 hover:bg-red-500/10 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                      >
                        <FiSquare className="w-4 h-4" />
                        Stop
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="xl:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Team Members</h2>
                <p className="text-gray-300">See what everyone is working on</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {teamMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>

              {/* Activity Feed */}
              <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 p-6 card-hover">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
                      <div className={`w-3 h-3 rounded-full ${activity.color} mt-2 flex-shrink-0`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-200">
                          <span className="font-semibold text-white">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
};

export default TeamFocusRoom;