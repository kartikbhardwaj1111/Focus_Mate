import React, { useState, useMemo } from 'react';
import {
  FiHome,
  FiClock,
  FiCheckSquare,
  FiBarChart2,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiCheckCircle,
  FiZap,
  FiTarget,
  FiPlay,
} from 'react-icons/fi';

const StatCard = ({ value, label, circleColor, icon }) => (
  <div className="rounded-xl bg-gray-900 p-6">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="mt-2 text-sm text-gray-400">{label}</div>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${circleColor}`}>
        <div className="text-white">{icon}</div>
      </div>
    </div>
  </div>
);

const Avatar = ({ src, alt }) => (
  <img src={src} alt={alt} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
);

const FocusMateDashboard = () => {
  const [completedTasks] = useState(0);
  const [totalTasks] = useState(0);

  const team = useMemo(
    () => [
      {
        id: '1',
        name: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        status: '👀 Focusing 15m left',
        color: 'text-green-400',
      },
      {
        id: '2',
        name: 'Alex Rivera',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        status: '☕ On break 3m left',
        color: 'text-yellow-400',
      },
      {
        id: '3',
        name: 'Jordan Kim',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
        status: '👀 Focusing 22m left',
        color: 'text-green-400',
      },
    ],
    []
  );

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col bg-gray-900 text-gray-300">
        <div className="p-6 text-xl font-bold text-blue-400">FocusMate</div>
        <nav className="px-4" aria-label="Sidebar Navigation">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg bg-blue-600 px-3 py-2 text-white transition-colors"
                aria-current="page"
              >
                <FiHome className="h-5 w-5" />
                <span className="text-sm font-medium">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <FiClock className="h-5 w-5" />
                <span className="text-sm font-medium">Timer</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <FiCheckSquare className="h-5 w-5" />
                <span className="text-sm font-medium">Tasks</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <FiBarChart2 className="h-5 w-5" />
                <span className="text-sm font-medium">Analytics</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <FiUsers className="h-5 w-5" />
                <span className="text-sm font-medium">Team</span>
              </a>
            </li>
          </ul>
          <div className="mt-6 border-t border-gray-800 pt-6">
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  <FiSettings className="h-5 w-5" />
                  <span className="text-sm font-medium">Settings</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Exit</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="mt-auto p-4 text-xs text-gray-500">© {new Date().getFullYear()} FocusMate</div>
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col p-6">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-white">Welcome back! 👋</h1>
          <p className="mt-2 text-lg text-gray-400">Ready to boost your productivity today?</p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              value="0m"
              label="Total Focus Time"
              circleColor="bg-blue-600"
              icon={<FiClock className="h-5 w-5" />}
            />
            <StatCard
              value="0"
              label="Completed Sessions"
              circleColor="bg-green-600"
              icon={<FiCheckCircle className="h-5 w-5" />}
            />
            <StatCard
              value="0"
              label="Tasks Completed"
              circleColor="bg-yellow-600"
              icon={<FiTarget className="h-5 w-5" />}
            />
            <StatCard
              value="0"
              label="Current Streak"
              circleColor="bg-purple-600"
              icon={<FiZap className="h-5 w-5" />}
            />
          </div>
        </header>

        {/* Two columns */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Quick Start */}
            <section className="rounded-xl bg-gray-900 p-6">
              <h2 className="text-lg font-semibold text-white">Quick Start</h2>
              <p className="mt-1 text-sm text-gray-400">Jump into a focused work session right away</p>
              <div className="mt-6 space-y-3">
                <button
                  className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white transition-colors hover:from-blue-600 hover:to-purple-700"
                >
                  <span className="inline-flex items-center gap-2 font-medium">
                    <FiPlay className="h-5 w-5" /> Start 25min Focus
                  </span>
                </button>
                <button className="w-full rounded-lg border border-gray-600 px-6 py-3 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                  Manage Tasks
                </button>
              </div>
            </section>

            {/* Today's Tasks */}
            <section className="rounded-xl bg-gray-900 p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-white">Today's Tasks</h2>
                <span className="text-sm text-gray-400">{completedTasks}/{totalTasks} completed</span>
              </div>
              <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-800 p-8 text-center">
                <FiCheckCircle className="h-12 w-12 text-gray-600" />
                <p className="mt-4 text-white">No tasks for today</p>
                <a href="#" className="mt-1 text-sm text-blue-400 hover:underline">
                  Add your first task
                </a>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div>
            <section className="rounded-xl bg-gray-900 p-6">
              <h2 className="text-lg font-semibold text-white">Team Activity</h2>
              <ul className="mt-6 space-y-4">
                {team.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    <Avatar src={m.avatar} alt={`${m.name} avatar`} />
                    <div>
                      <div className="text-sm font-medium text-white">{m.name}</div>
                      <div className={`text-xs ${m.color}`}>{m.status}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="mt-6 text-sm font-medium text-blue-400 hover:text-blue-300">
                Join Team Room
              </button>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FocusMateDashboard;