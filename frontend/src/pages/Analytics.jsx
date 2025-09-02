import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { 
  FiClock, 
  FiCheckCircle, 
  FiTarget, 
  FiZap, 
  FiTrendingUp,
  FiDownload,
  FiCalendar,
  FiActivity,
  FiAward,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import SidebarNav from '../components/SidebarNav.jsx';
import api from '../utils/api';

// Enhanced color palette
const COLORS = {
  primary: '#6B8CFF',
  secondary: '#B776FF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  }
};

// Modern Sidebar Component
const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const navItems = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/timer', icon: FiClock, label: 'Timer' },
    { to: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
    { to: '/analytics', icon: FiBarChart2, label: 'Analytics', active: true },
    { to: '/team-room', icon: FiUsers, label: 'Team Room' },
  ];

  const SidebarContent = (
    <div className="flex h-full w-64 flex-col bg-[#0f1113] border-r border-white/10 text-[var(--page-fg)]">
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <Link to="/" className="text-2xl font-bold">
          <span className="gradient-text">Focus</span>
          <span className="text-white">Mate</span>
        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  item.active
                    ? 'bg-gradient-to-r from-[var(--grad-start)] to-[var(--grad-end)] text-white shadow-lg'
                    : 'text-[#bdbdbf] hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t border-white/10 p-4">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#bdbdbf] hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <FiSettings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div
        className={`fixed inset-0 z-50 transform transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative h-full">{SidebarContent}</div>
      </div>
    );
  }

  return <aside className="hidden lg:block">{SidebarContent}</aside>;
};

// Enhanced demo data with better visuals
const weeklyData = {
  focusTimeData: [
    { period: 'Mon', hours: 3.5, sessions: 8 },
    { period: 'Tue', hours: 4.2, sessions: 10 },
    { period: 'Wed', hours: 5.8, sessions: 14 },
    { period: 'Thu', hours: 2.1, sessions: 5 },
    { period: 'Fri', hours: 4.7, sessions: 11 },
    { period: 'Sat', hours: 1.5, sessions: 3 },
    { period: 'Sun', hours: 2.3, sessions: 6 },
  ],
  sessionData: [
    { period: 'Mon', completed: 8, target: 10, efficiency: 85 },
    { period: 'Tue', completed: 10, target: 10, efficiency: 92 },
    { period: 'Wed', completed: 14, target: 12, efficiency: 96 },
    { period: 'Thu', completed: 5, target: 10, efficiency: 78 },
    { period: 'Fri', completed: 11, target: 10, efficiency: 88 },
    { period: 'Sat', completed: 3, target: 5, efficiency: 82 },
    { period: 'Sun', completed: 6, target: 8, efficiency: 79 },
  ],
  timeDistData: [
    { name: 'Deep Focus', value: 68, color: COLORS.primary },
    { name: 'Short Breaks', value: 15, color: COLORS.success },
    { name: 'Long Breaks', value: 12, color: COLORS.warning },
    { name: 'Distractions', value: 5, color: COLORS.error },
  ],
  productivityTrend: [
    { period: 'Mon', productivity: 85, mood: 7.2 },
    { period: 'Tue', productivity: 92, mood: 8.1 },
    { period: 'Wed', productivity: 96, mood: 8.7 },
    { period: 'Thu', productivity: 78, mood: 6.5 },
    { period: 'Fri', productivity: 88, mood: 7.8 },
    { period: 'Sat', productivity: 82, mood: 7.0 },
    { period: 'Sun', productivity: 79, mood: 6.8 },
  ]
};

const dailyData = {
  focusTimeData: [
    { period: '6 AM', hours: 0.5, sessions: 1 },
    { period: '8 AM', hours: 1.2, sessions: 3 },
    { period: '10 AM', hours: 2.1, sessions: 5 },
    { period: '12 PM', hours: 1.8, sessions: 4 },
    { period: '2 PM', hours: 1.5, sessions: 3 },
    { period: '4 PM', hours: 2.3, sessions: 5 },
    { period: '6 PM', hours: 1.1, sessions: 2 },
    { period: '8 PM', hours: 0.8, sessions: 2 },
  ],
  sessionData: [
    { period: '6 AM', completed: 1, target: 2, efficiency: 75 },
    { period: '8 AM', completed: 3, target: 3, efficiency: 88 },
    { period: '10 AM', completed: 5, target: 4, efficiency: 95 },
    { period: '12 PM', completed: 4, target: 4, efficiency: 82 },
    { period: '2 PM', completed: 3, target: 4, efficiency: 78 },
    { period: '4 PM', completed: 5, target: 4, efficiency: 92 },
    { period: '6 PM', completed: 2, target: 3, efficiency: 85 },
    { period: '8 PM', completed: 2, target: 2, efficiency: 80 },
  ],
  timeDistData: [
    { name: 'Deep Focus', value: 72, color: COLORS.primary },
    { name: 'Short Breaks', value: 18, color: COLORS.success },
    { name: 'Long Breaks', value: 8, color: COLORS.warning },
    { name: 'Distractions', value: 2, color: COLORS.error },
  ],
  productivityTrend: [
    { period: '6 AM', productivity: 75, mood: 6.5 },
    { period: '8 AM', productivity: 88, mood: 7.8 },
    { period: '10 AM', productivity: 95, mood: 8.5 },
    { period: '12 PM', productivity: 82, mood: 7.2 },
    { period: '2 PM', productivity: 78, mood: 6.8 },
    { period: '4 PM', productivity: 92, mood: 8.2 },
    { period: '6 PM', productivity: 85, mood: 7.5 },
    { period: '8 PM', productivity: 80, mood: 7.0 },
  ]
};

const monthlyData = {
  focusTimeData: [
    { period: 'Week 1', hours: 28.5, sessions: 68 },
    { period: 'Week 2', hours: 32.1, sessions: 76 },
    { period: 'Week 3', hours: 29.8, sessions: 71 },
    { period: 'Week 4', hours: 35.2, sessions: 84 },
  ],
  sessionData: [
    { period: 'Week 1', completed: 68, target: 70, efficiency: 87 },
    { period: 'Week 2', completed: 76, target: 70, efficiency: 91 },
    { period: 'Week 3', completed: 71, target: 70, efficiency: 89 },
    { period: 'Week 4', completed: 84, target: 70, efficiency: 94 },
  ],
  timeDistData: [
    { name: 'Deep Focus', value: 65, color: COLORS.primary },
    { name: 'Short Breaks', value: 20, color: COLORS.success },
    { name: 'Long Breaks', value: 10, color: COLORS.warning },
    { name: 'Distractions', value: 5, color: COLORS.error },
  ],
  productivityTrend: [
    { period: 'Week 1', productivity: 87, mood: 7.5 },
    { period: 'Week 2', productivity: 91, mood: 8.1 },
    { period: 'Week 3', productivity: 89, mood: 7.8 },
    { period: 'Week 4', productivity: 94, mood: 8.4 },
  ]
};

// Modern Stat Card Component
const StatCard = ({ title, value, change, changeType, icon: Icon, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-2xl bg-[#0f1113] border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-[#bdbdbf] mb-1">{title}</p>
        <p className="text-3xl font-bold text-white mb-2">{value}</p>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${
            changeType === 'positive' ? 'text-green-400' : 
            changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
          }`}>
            <FiTrendingUp className="h-3 w-3" />
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${gradient} shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    <div className={`absolute inset-0 opacity-5 ${gradient}`} />
  </motion.div>
);

// Modern Chart Container
const ChartContainer = ({ title, subtitle, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-2xl bg-[#0f1113] border border-white/10 p-6 hover:border-white/20 transition-all duration-300 ${className}`}
  >
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-[#bdbdbf]">{subtitle}</p>}
    </div>
    {children}
  </motion.div>
);

const Analytics = () => {
  const [timePeriod, setTimePeriod] = useState('Weekly');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get current data based on time period
  const getCurrentData = () => {
    switch (timePeriod) {
      case 'Daily': return dailyData;
      case 'Monthly': return monthlyData;
      default: return weeklyData;
    }
  };

  const currentData = getCurrentData();

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalHours = currentData.focusTimeData.reduce((sum, item) => sum + item.hours, 0);
    const totalSessions = currentData.focusTimeData.reduce((sum, item) => sum + item.sessions, 0);
    const avgEfficiency = Math.round(
      currentData.sessionData.reduce((sum, item) => sum + item.efficiency, 0) / currentData.sessionData.length
    );
    const streak = timePeriod === 'Daily' ? 7 : timePeriod === 'Weekly' ? 4 : 12;

    return {
      totalFocusTime: `${Math.floor(totalHours)}h ${Math.round((totalHours % 1) * 60)}m`,
      completedSessions: totalSessions,
      avgEfficiency: `${avgEfficiency}%`,
      currentStreak: `${streak} days`,
    };
  }, [currentData, timePeriod]);

  const exportData = () => {
    const exportData = {
      period: timePeriod,
      generatedAt: new Date().toISOString(),
      summary: summaryStats,
      focusTimeData: currentData.focusTimeData,
      sessionData: currentData.sessionData,
      timeDistribution: currentData.timeDistData,
      productivityTrend: currentData.productivityTrend,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusmate-analytics-${timePeriod.toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const TimeButton = ({ period, active, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
        active
          ? 'bg-gradient-to-r from-[var(--grad-start)] to-[var(--grad-end)] text-white shadow-lg'
          : 'bg-[#1a1a1d] text-[#bdbdbf] hover:bg-[#2a2a2d] hover:text-white border border-white/10'
      }`}
    >
      {period}
    </motion.button>
  );

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-[var(--page-fg)]">
      {/* Background elements */}
      <div className="bg-blob left" />
      <div className="bg-blob right" />
      <div className="floating-dots" />
      
      <div className="flex min-h-screen relative z-10">
        <SidebarNav />

        <main className="flex-1 flex flex-col min-h-screen">
          {/* Mobile Header */}
          <div className="flex items-center justify-between bg-[#0f1113] border-b border-white/10 p-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <Link to="/" className="text-xl font-bold">
              <span className="gradient-text">Focus</span>
              <span className="text-white">Mate</span>
            </Link>
            <div className="w-9" />
          </div>

          <div className="flex-1 p-6 lg:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  📊 Analytics Dashboard
                </h1>
                <p className="text-lg text-[#bdbdbf]">
                  Track your productivity insights and progress over time
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <FiCalendar className="h-4 w-4 text-[#bdbdbf]" />
                  <div className="flex gap-1">
                    {['Daily', 'Weekly', 'Monthly'].map((period) => (
                      <TimeButton
                        key={period}
                        period={period}
                        active={timePeriod === period}
                        onClick={() => setTimePeriod(period)}
                      />
                    ))}
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportData}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1a1d] text-[#bdbdbf] hover:bg-[#2a2a2d] hover:text-white border border-white/10 transition-all duration-200"
                >
                  <FiDownload className="h-4 w-4" />
                  <span className="hidden sm:block">Export</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Focus Time"
                value={summaryStats.totalFocusTime}
                change="+12% from last period"
                changeType="positive"
                icon={FiClock}
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <StatCard
                title="Completed Sessions"
                value={summaryStats.completedSessions}
                change="+8% from last period"
                changeType="positive"
                icon={FiCheckCircle}
                gradient="bg-gradient-to-br from-green-500 to-green-600"
              />
              <StatCard
                title="Average Efficiency"
                value={summaryStats.avgEfficiency}
                change="+5% from last period"
                changeType="positive"
                icon={FiActivity}
                gradient="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <StatCard
                title="Current Streak"
                value={summaryStats.currentStreak}
                change="Personal best!"
                changeType="positive"
                icon={FiAward}
                gradient="bg-gradient-to-br from-orange-500 to-orange-600"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Focus Time Trends */}
              <ChartContainer
                title="🎯 Focus Time Trends"
                subtitle={`${timePeriod} breakdown of your focus sessions`}
              >
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentData.focusTimeData}>
                      <defs>
                        <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="period" 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#0f1113', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px',
                          color: '#fff',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="hours" 
                        stroke={COLORS.primary} 
                        strokeWidth={3}
                        fill="url(#focusGradient)"
                        dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: COLORS.primary, strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ChartContainer>

              {/* Session Progress */}
              <ChartContainer
                title="⚡ Session Progress"
                subtitle="Completed vs target sessions"
              >
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData.sessionData} barGap={10}>
                      <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="period" 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#0f1113', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px',
                          color: '#fff',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                        }} 
                      />
                      <Legend />
                      <Bar 
                        dataKey="completed" 
                        name="Completed" 
                        fill={COLORS.success} 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="target" 
                        name="Target" 
                        fill={COLORS.warning} 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartContainer>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Time Distribution */}
              <ChartContainer
                title="⏰ Time Distribution"
                subtitle="How you spend your focus time"
                className="lg:col-span-1"
              >
                <div className="flex flex-col items-center">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentData.timeDistData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {currentData.timeDistData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            background: '#0f1113', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '12px',
                            color: '#fff'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full mt-4">
                    {currentData.timeDistData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-[#1a1a1d] border border-white/5">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{item.value}%</div>
                          <div className="text-xs text-[#bdbdbf]">{item.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartContainer>

              {/* Productivity Insights */}
              <ChartContainer
                title="🔥 Productivity Insights"
                subtitle="Key performance indicators"
                className="lg:col-span-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400 mb-1">Wednesday</div>
                    <div className="text-sm text-[#bdbdbf]">Most productive day</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400 mb-1">10-12 AM</div>
                    <div className="text-sm text-[#bdbdbf]">Peak focus hours</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-400 mb-1">94%</div>
                    <div className="text-sm text-[#bdbdbf]">Goal achievement</div>
                  </div>
                </div>
                
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentData.productivityTrend}>
                      <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="period" 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#0f1113', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px',
                          color: '#fff'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="productivity" 
                        name="Productivity"
                        stroke={COLORS.primary} 
                        strokeWidth={3}
                        dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        name="Mood (x10)"
                        stroke={COLORS.secondary} 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;