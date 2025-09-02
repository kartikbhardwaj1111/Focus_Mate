import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import HeroSection from '../components/HeroSection.jsx';
import GradientButton from '../components/GradientButton.jsx';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  Clock, 
  Sparkles, 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp,
  CheckCircle,
  Timer,
  BarChart3,
  Heart,
  Focus,
  Lightbulb,
  Award,
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

// Enhanced Feature Section Component
const EnhancedFeatureSection = ({ icon: Icon, title, subtitle, description, features, stats, delay = 0, reverse = false }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.6 }}
      className={`mx-auto max-w-7xl px-6 py-24 ${reverse ? 'lg:py-40' : 'lg:py-32'}`}
    >
      <div className={`grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}>
        {/* Content Side */}
        <div className={reverse ? 'lg:col-start-2' : ''}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[var(--grad-start)] to-[var(--grad-end)] shadow-lg">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold gradient-text">{title}</h2>
              <p className="text-lg text-[#bdbdbf] mt-1">{subtitle}</p>
            </div>
          </div>
          
          <p className="text-xl text-[#e5e5e7] leading-relaxed mb-8">
            {description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.1 + (index * 0.1), duration: 0.4 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-[#0f1113] border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-[#e5e5e7]">{feature}</span>
              </motion.div>
            ))}
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0f1113] to-[#1a1a1d] border border-white/5">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-[#bdbdbf]">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visual Side */}
        <div className={`${reverse ? 'lg:col-start-1' : ''}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--grad-start)]/20 to-[var(--grad-end)]/20 rounded-3xl blur-xl"></div>
            <div className="relative p-8 rounded-3xl bg-[#0f1113] border border-white/10 backdrop-blur-sm">
              {title === 'Deep Focus' && <DeepFocusDemo />}
              {title === 'Accountability' && <AccountabilityDemo />}
              {title === 'Ritual & Rhythm' && <RitualDemo />}
              {title === 'Calm Productivity' && <CalmProductivityDemo />}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// Demo Components for each feature
const DeepFocusDemo = () => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(1500); // 25 minutes in seconds
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="text-6xl font-mono font-bold text-white mb-4">
          {formatTime(time)}
        </div>
        <div className="text-[#bdbdbf] mb-6">Focus Session</div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate('/join')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--grad-start)] to-[var(--grad-end)] text-white font-medium hover:scale-105 transition-transform"
          >
            <Play className="h-4 w-4" />
            Start
          </button>
          <button
            onClick={() => { setTime(1500); setIsActive(false); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1d] text-white hover:bg-[#2a2a2d] transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 rounded-lg bg-[#1a1a1d]">
          <div className="text-green-400 font-semibold">Sessions Today</div>
          <div className="text-white text-lg">3</div>
        </div>
        <div className="p-3 rounded-lg bg-[#1a1a1d]">
          <div className="text-blue-400 font-semibold">Focus Streak</div>
          <div className="text-white text-lg">7 days</div>
        </div>
      </div>
    </div>
  );
};

const AccountabilityDemo = () => {
  const teammates = [
    { name: 'Sarah', status: 'focusing', time: '18:42', avatar: '👩‍💻' },
    { name: 'Alex', status: 'break', time: '04:15', avatar: '👨‍💼' },
    { name: 'Jordan', status: 'focusing', time: '22:08', avatar: '👩‍🎨' },
  ];

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Team Focus Room</h3>
        <p className="text-[#bdbdbf]">3 members currently active</p>
      </div>
      <div className="space-y-3">
        {teammates.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1d] border border-white/5"
          >
            <div className="text-2xl">{member.avatar}</div>
            <div className="flex-1">
              <div className="text-white font-medium">{member.name}</div>
              <div className={`text-sm ${member.status === 'focusing' ? 'text-green-400' : 'text-yellow-400'}`}>
                {member.status === 'focusing' ? '🎯 Focusing' : '☕ On break'} • {member.time}
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${member.status === 'focusing' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-[var(--grad-start)]/10 to-[var(--grad-end)]/10 border border-[var(--grad-start)]/20">
        <div className="text-center text-sm text-[#bdbdbf]">
          💪 Team completed <span className="text-white font-semibold">47 sessions</span> today
        </div>
      </div>
    </div>
  );
};

const RitualDemo = () => {
  const schedule = [
    { time: '09:00', task: 'Deep Work Block', status: 'completed' },
    { time: '09:25', task: 'Short Break', status: 'completed' },
    { time: '09:30', task: 'Email & Messages', status: 'active' },
    { time: '10:00', task: 'Creative Work', status: 'upcoming' },
    { time: '10:25', task: 'Break & Stretch', status: 'upcoming' },
  ];

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Today's Rhythm</h3>
        <p className="text-[#bdbdbf]">Structured for optimal flow</p>
      </div>
      <div className="space-y-2">
        {schedule.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              item.status === 'completed' 
                ? 'bg-green-500/10 border-green-500/20' 
                : item.status === 'active'
                ? 'bg-[var(--grad-start)]/10 border-[var(--grad-start)]/30'
                : 'bg-[#1a1a1d] border-white/5'
            }`}
          >
            <div className="text-[#bdbdbf] font-mono text-sm w-12">{item.time}</div>
            <div className="flex-1">
              <div className={`font-medium ${
                item.status === 'completed' ? 'text-green-400' : 
                item.status === 'active' ? 'text-white' : 'text-[#bdbdbf]'
              }`}>
                {item.task}
              </div>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              item.status === 'completed' ? 'bg-green-400' : 
              item.status === 'active' ? 'bg-[var(--grad-start)]' : 'bg-gray-600'
            }`}></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CalmProductivityDemo = () => {
  const metrics = [
    { label: 'Stress Level', value: 23, color: 'green' },
    { label: 'Focus Quality', value: 87, color: 'blue' },
    { label: 'Energy', value: 76, color: 'purple' },
  ];

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Wellness Dashboard</h3>
        <p className="text-[#bdbdbf]">Balanced productivity metrics</p>
      </div>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-[#bdbdbf]">{metric.label}</span>
              <span className="text-white font-medium">{metric.value}%</span>
            </div>
            <div className="h-2 bg-[#1a1a1d] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ delay: index * 0.2 + 0.3, duration: 0.8 }}
                className={`h-full rounded-full ${
                  metric.color === 'green' ? 'bg-green-400' :
                  metric.color === 'blue' ? 'bg-blue-400' : 'bg-purple-400'
                }`}
              ></motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <Heart className="h-4 w-4" />
          <span>Optimal work-life balance maintained</span>
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Deep Focus",
      subtitle: "Enter the flow state",
      description: "Transform scattered attention into laser-sharp focus with scientifically-backed Pomodoro sessions. Our intelligent timer adapts to your natural rhythms, helping you achieve deeper concentration and breakthrough productivity.",
      features: [
        "25-minute focused work sessions",
        "Distraction-blocking interface",
        "Flow state optimization",
        "Progress tracking & insights"
      ],
      stats: [
        { value: "87%", label: "Focus Improvement" },
        { value: "2.3x", label: "Productivity Boost" },
        { value: "45min", label: "Avg Deep Work" }
      ]
    },
    {
      icon: Users,
      title: "Accountability",
      subtitle: "Stronger together",
      description: "Join virtual focus rooms where commitment meets community. Work alongside motivated individuals, share your goals, and stay accountable through gentle peer support and shared achievements.",
      features: [
        "Virtual co-working spaces",
        "Real-time team progress",
        "Gentle accountability nudges",
        "Shared milestone celebrations"
      ],
      stats: [
        { value: "94%", label: "Goal Completion" },
        { value: "12k+", label: "Active Members" },
        { value: "3.2x", label: "Consistency Boost" }
      ]
    },
    {
      icon: Clock,
      title: "Ritual & Rhythm",
      subtitle: "Build lasting habits",
      description: "Create sustainable productivity rituals that fit your lifestyle. Our flexible scheduling system helps you establish consistent work patterns while maintaining the spontaneity you need for creative breakthroughs.",
      features: [
        "Personalized work schedules",
        "Habit formation tracking",
        "Flexible routine templates",
        "Energy-based optimization"
      ],
      stats: [
        { value: "21", label: "Days to Habit" },
        { value: "89%", label: "Routine Success" },
        { value: "4.1", label: "Weekly Sessions" }
      ]
    },
    {
      icon: Sparkles,
      title: "Calm Productivity",
      subtitle: "Stress-free achievement",
      description: "Experience productivity without burnout through our mindful approach to work. Beautiful, calming interfaces combined with wellness-focused features ensure you achieve more while feeling better about your work.",
      features: [
        "Stress-reducing design",
        "Mindful break reminders",
        "Wellness metrics tracking",
        "Burnout prevention alerts"
      ],
      stats: [
        { value: "67%", label: "Stress Reduction" },
        { value: "4.8/5", label: "User Satisfaction" },
        { value: "92%", label: "Feel Energized" }
      ]
    }
  ];

  return (
    <div className="relative overflow-hidden bg-[var(--page-bg)] text-[var(--page-fg)]">
      {/* Animated background */}
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Navbar />

        <main className="relative z-10">
          {/* Hero Section */}
          <div className="px-6 pb-20">
            <HeroSection onGetStarted={() => navigate('/join')} />
          </div>

          {/* Enhanced Feature Sections with scroll reveal */}
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <EnhancedFeatureSection
                icon={feature.icon}
                title={feature.title}
                subtitle={feature.subtitle}
                description={feature.description}
                features={feature.features}
                stats={feature.stats}
                delay={index * 0.1}
                reverse={index % 2 === 1}
              />
            </motion.div>
          ))}

          {/* Call to Action Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl px-6 py-20 text-center"
          >
            <div className="rounded-3xl bg-gradient-to-br from-[#0f1113] to-[#1a1a1d] border border-white/10 p-12">
              <h2 className="text-4xl font-bold gradient-text mb-4">
                Ready to Transform Your Productivity?
              </h2>
              <p className="text-xl text-[#bdbdbf] mb-8 max-w-2xl mx-auto">
                Join thousands of focused individuals who've discovered the power of intentional work. 
                Start your journey to deeper focus and calmer productivity today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GradientButton 
                  onClick={() => navigate('/join')}
                  className="px-8 py-4 text-lg"
                >
                  Start Your First Session
                  <ArrowRight className="ml-2 h-5 w-5" />
                </GradientButton>
                <button
                  onClick={() => navigate('/join')}
                  className="px-8 py-4 text-lg rounded-xl border-2 border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                >
                  Join the Community
                </button>
              </div>
            </div>
          </motion.section>

          {/* Footer spacing */}
          <div className="h-20"></div>
        </main>
      </motion.div>
    </div>
  );
};

export default Landing;