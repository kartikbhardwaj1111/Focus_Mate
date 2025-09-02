import React, { useEffect, useMemo, useState } from 'react';
import {
  FiClock,
  FiCheckCircle,
  FiTarget,
  FiZap,
  FiPlay,
  FiHome,
  FiCheckSquare,
  FiBarChart2,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TopControls from './TopControls.jsx';
import SidebarNav from './SidebarNav.jsx';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Simple avatar component
const Avatar = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="h-10 w-10 rounded-full object-cover"
    loading="lazy"
  />
);

const Sidebar = ({ open, onClose, isMobile }) => {
  const location = useLocation();
  const current = location.pathname;

  const navTop = [
    { key: 'dashboard', label: 'Dashboard', icon: <FiHome className="h-5 w-5" />, to: '/dashboard' },
    { key: 'timer', label: 'Timer', icon: <FiClock className="h-5 w-5" />, to: '/timer' },
    { key: 'tasks', label: 'Tasks', icon: <FiCheckSquare className="h-5 w-5" />, to: '/tasks' },
    { key: 'analytics', label: 'Analytics', icon: <FiBarChart2 className="h-5 w-5" />, to: '/analytics' },
    { key: 'team', label: 'Team Room', icon: <FiUsers className="h-5 w-5" />, to: '/team-room' },
  ];

  const navBottom = [
    { key: 'settings', label: 'Settings', icon: <FiSettings className="h-5 w-5" />, to: '/settings' },
    { key: 'exit', label: 'Exit', icon: <FiLogOut className="h-5 w-5" />, to: '/' },
  ];

  const SidebarContent = (
    <div className="flex h-full w-64 flex-col bg-gray-800/50 backdrop-blur border-r border-gray-700 text-gray-300">
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">FocusMate</Link>
        {isMobile && (
          <button
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav aria-label="Primary Navigation" className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-2">
          {navTop.map((item) => {
            const active = current === item.to;
            return (
              <li key={item.key}>
                <Link
                  to={item.to}
                  role="menuitem"
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white',
                  ].join(' ')}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-auto border-t border-gray-700 p-4">
        <ul className="space-y-2">
          {navBottom.map((item) => (
            <li key={item.key}>
              <Link
                to={item.to}
                role="menuitem"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:bg-gray-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Local Sidebar replaced by shared SidebarNav for consistency
  return null;
};

const StatCardItem = ({ value, label, icon, circleBg }) => {
  return (
    <div className="relative rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700 p-6 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${circleBg} shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
};

const QuickStartSection = ({ onStart, onManageTasks }) => (
  <section aria-labelledby="quick-start-title" className="rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700 p-6 hover:bg-gray-800/70 transition-all duration-300">
    <div className="flex items-center gap-2 mb-2">
      <FiPlay className="h-5 w-5 text-blue-400" aria-hidden="true" />
      <h2 id="quick-start-title" className="text-xl font-bold text-white">
        Quick Start
      </h2>
    </div>
    <p className="text-gray-300">Jump into a focused work session right away</p>

    <div className="mt-6 space-y-3">
      <button
        onClick={onStart}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white font-medium transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
        aria-label="Start 25 minute Focus Session"
      >
        <FiClock className="h-5 w-5" />
        <span>Start 25min Focus</span>
      </button>

      <button
        onClick={onManageTasks}
        className="w-full rounded-lg border-2 border-gray-600 px-6 py-3 text-gray-400 font-medium transition-all duration-200 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Manage Tasks
      </button>
    </div>
  </section>
);

const TodaysTasksSection = ({tasks, completed, total }) => (
  <section
    aria-labelledby="today-tasks-title"
    className="rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700 p-6 hover:bg-gray-800/70 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-2">
      <h2 id="today-tasks-title" className="text-xl font-bold text-white">
        📋 Today's Tasks
      </h2>
      <span className="text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
        {completed}/{total} completed
      </span>
    </div>

    {total === 0 ? (
      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 p-8 text-center hover:border-gray-500 transition-colors duration-200">
        <FiCheckCircle className="h-12 w-12 text-gray-500" aria-hidden="true" />
        <p className="mt-4 text-white font-medium">No tasks for today</p>
        <a
          href="#"
          className="mt-2 text-sm text-blue-400 hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Add your first task
        </a>
      </div>
    ) : (
      <ul className="mt-6 space-y-3">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors duration-200"
          >
            <input type="checkbox" checked={task.completed} readOnly />
            <span className={`text-white ${task.completed ? "line-through text-gray-400" : ""}`}>
              {task.title}
            </span>
          </li>
        ))}
      </ul>
    )}
  </section>
);

const TeamActivitySection = ({ team }) => (
  <section aria-labelledby="team-activity-title" className="rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700 p-6 hover:bg-gray-800/70 transition-all duration-300">
    <h2 id="team-activity-title" className="text-xl font-bold text-white mb-2">
      👥 Team Activity
    </h2>

    <ul className="mt-6 space-y-4">
      {team.map((member) => {
        const statusColor =
          member.status === 'focusing'
            ? 'text-green-400'
            : member.status === 'break'
            ? 'text-yellow-400'
            : 'text-gray-500';
        return (
          <li key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors duration-200">
            <Avatar src={member.avatar} alt={`${member.name} avatar`} />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{member.name}</div>
              <div className={`text-xs ${statusColor}`}>
                {member.activity}
                {member.timeLeft ? ` ${member.timeLeft}` : ''}
              </div>
            </div>
            <FiChevronRight className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </li>
        );
      })}
    </ul>

    <Link
      to="/team-room"
      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      aria-label="Join Team Room"
    >
      Join Team Room
      <FiChevronRight className="h-4 w-4" />
    </Link>
  </section>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedTasks] = useState(0);
  const [totalTasks] = useState(0);
  const navigate = useNavigate()

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const team = useMemo(
    () => [
      {
        id: '1',
        name: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        status: 'focusing',
        timeLeft: '15m left',
        activity: '👀 Focusing',
      },
      {
        id: '2',
        name: 'Alex Rivera',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        status: 'break',
        timeLeft: '3m left',
        activity: '☕ On break',
      },
      {
        id: '3',
        name: 'Jordan Kim',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
        status: 'focusing',
        timeLeft: '22m left',
        activity: '👀 Focusing',
      },
    ],
    []
  );

  const [stats, setStats] = useState([
    {
      id: 'total-time',
      value: '0m',
      label: 'Total Focus Time',
      icon: <FiClock className="h-5 w-5" />,
      circleBg: 'bg-blue-600',
    },
    {
      id: 'completed-sessions',
      value: '0',
      label: 'Completed Sessions',
      icon: <FiCheckCircle className="h-5 w-5" />,
      circleBg: 'bg-green-600',
    },
    {
      id: 'tasks-completed',
      value: '0',
      label: 'Tasks Completed',
      icon: <FiTarget className="h-5 w-5" />,
      circleBg: 'bg-yellow-600',
    },
    {
      id: 'current-streak',
      value: '0',
      label: 'Current Streak',
      icon: <FiZap className="h-5 w-5" />,
      circleBg: 'bg-purple-600',
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
              return { ...stat, value: `${v}m` };
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

  const [tasks, setTasks] = useState([]); 

  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        const today = new Date().toISOString().split("T")[0]; // e.g. "2025-08-20"
        const todaysTasks = res.data.filter((task) => {
          const createdDate = new Date(task.createdAt).toISOString().split("T")[0];
          return createdDate === today;
        });
        setTasks(todaysTasks);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  fetchTasks();
  }, []);


  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-[var(--page-fg)]">
      {/* Background elements */}
      <div className="bg-blob left" />
      <div className="bg-blob right" />
      <div className="floating-dots" />
      
      <div className="flex min-h-screen relative z-10">
        <SidebarNav />

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur border-b border-gray-700 p-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <Link to="/" className="text-base font-bold text-blue-400 hover:text-blue-300 transition-colors">FocusMate</Link>
            <TopControls />
          </div>

          <main className="flex-1 overflow-auto">
            {/* Header Section */}
            <div className="bg-gray-800/50 backdrop-blur border-b border-gray-700 px-8 py-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">Welcome back! 👋</h1>
                  <p className="mt-2 text-lg text-gray-300">Ready to boost your productivity today?</p>
                </div>
                <TopControls />
              </div>
            </div>

            <div className="p-8">
              {/* Stats Section */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((s) => (
                  <StatCardItem key={s.id} value={s.value} label={s.label} icon={s.icon} circleBg={s.circleBg} />
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <QuickStartSection
                    onStart={() => navigate("/timer")}
                  />
                  <TodaysTasksSection
                    tasks={tasks}
                    completed={tasks.filter((t) => t.status === "completed").length}
                    total={tasks.length}
                  />


                </div>
                <div>
                  <TeamActivitySection team={team} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;