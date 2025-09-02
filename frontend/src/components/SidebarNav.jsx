import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiClock, FiCheckSquare, FiBarChart2, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';

// Shared, consistent sidebar used across app pages
const SidebarNav = () => {
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
  ];

  return (
    <aside className="hidden w-64 shrink-0 bg-gray-800/50 backdrop-blur border-r border-gray-700 text-gray-300 lg:block">
      <div className="flex h-full flex-col">
        <div className="p-6 border-b border-gray-700">
          <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">FocusMate</Link>
        </div>
        <nav aria-label="Primary Navigation" className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-2">
            {navTop.map((item) => {
              const active = current === item.to;
              return (
                <li key={item.key}>
                  <Link
                    to={item.to}
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
          <div className="mt-6 border-t border-gray-800 pt-6">
            <ul className="space-y-2">
              {navBottom.map((item) => (
                <li key={item.key}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
              {/* Exit with confirm */}
              <li>
                <button
                  onClick={async () => {
                    if (!confirm('Do you want to logout?')) return;
                    try {
                      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                      window.location.href = '/';
                    } catch (_) {
                      window.location.href = '/';
                    }
                  }}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Exit</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
        <div className="p-4 text-xs text-gray-600">© {new Date().getFullYear()} FocusMate</div>
      </div>
    </aside>
  );
};

export default SidebarNav;