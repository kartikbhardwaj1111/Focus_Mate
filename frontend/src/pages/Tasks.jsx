import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiAlertCircle } from 'react-icons/fi';
import SidebarNav from '../components/SidebarNav.jsx';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || '/api';
import { format } from "date-fns";

// Types via JSDoc for clarity
/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {'open'|'in-progress'|'completed'|'overdue'} status
 * @property {'high'|'medium'|'low'} priority
 * @property {string} dueDate // could be a label like "today" or a date string
 * @property {Date} createdAt
 */

const Sidebar = () => {
  // Sidebar now unified via SidebarNav component -> this local component is no longer used
  return null;
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    high: 'bg-red-500/20 text-red-400 border border-red-500/30',
    medium: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    low: 'bg-green-500/20 text-green-400 border border-green-500/30',
  };
  const label = priority === 'high' ? 'High' : priority === 'medium' ? 'Medium' : 'Low';
  return <span className={`rounded-md px-2.5 py-1 text-xs ${styles[priority]}`}>{label}</span>;
};

const StatusIcon = ({ status }) => {
  if (status === 'completed') {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white">
        <FiCheck className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (status === 'in-progress') {
    return <span className="h-5 w-5 rounded-full bg-yellow-400" />;
  }
  if (status === 'overdue') {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white">
        <FiAlertCircle className="h-3.5 w-3.5" />
      </span>
    );
  }
  // open
  return <span className="h-5 w-5 rounded-full border border-gray-500" />;
};

const TaskModal = ({ mode = 'add', initial, onClose, onSave }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [status, setStatus] = useState(initial?.status || 'open');
  const [priority, setPriority] = useState(initial?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initial?.dueDate || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...(initial || {}),
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || 'today',
      createdAt: initial?.createdAt || new Date(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl bg-gray-900 p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-white">{mode === 'add' ? 'Add New Task' : 'Edit Task'}</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-400">Title</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 p-2.5 text-white outline-none focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400">Description</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 p-2.5 text-white outline-none focus:border-blue-500"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div>
              <label className="block text-xs text-gray-500">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white outline-none focus:border-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Priority</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white outline-none focus:border-blue-500"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500">Due Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white outline-none focus:border-blue-500"
                value={/\d{4}-\d{2}-\d{2}/.test(dueDate) ? dueDate : ''}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">Leave empty to set as "today"</p>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-800">Cancel</button>
            <button type="submit" className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 font-medium text-white hover:from-blue-600 hover:to-purple-700">{mode === 'add' ? 'Add Task' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, onChangePriority }) => {
  const formattedDueDate = format(new Date(task.dueDate), "MMM d, yyyy");
  return (
    <div className="mb-4 rounded-xl bg-gray-900 p-4 transition-all duration-200 hover:bg-gray-800">
      <div className="flex items-start gap-3">
        {/* Left: status/checkbox */}
        <button
          onClick={() => onToggleComplete(task)}
          className="mt-0.5 flex h-6 w-6 items-center justify-center"
          title={task.status === 'completed' ? 'Mark as open' : 'Mark as complete'}
        >
          <StatusIcon status={task.status} />
        </button>

        {/* Middle: content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-lg font-semibold text-white">{task.title}</h4>
            <div className="flex items-center gap-2">
              {/* Priority dropdown */}
              <select
                aria-label="Change priority"
                className="rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-300 focus:border-blue-500"
                value={task.priority}
                onChange={(e) => onChangePriority(task._id, e.target.value)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <PriorityBadge priority={task.priority} />

              {/* Actions */}
              <button
                aria-label="Edit task"
                className="rounded p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                onClick={() => onEdit(task)}
              >
                <FiEdit2 className="h-4 w-4" />
              </button>
              <button
                aria-label="Delete task"
                className="rounded p-2 text-red-400 hover:bg-red-500/10"
                onClick={() => onDelete(task)}
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-400">{task.description}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <FiClock className="h-3.5 w-3.5" />
            <span>Due: {formattedDueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TasksPage = () => {
  /** @type {[Task[], Function]} */
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get(`${API_URL}/tasks`, {
        withCredentials: true,  
      });
      if (res.status === 200) {
        setTasks(res.data);
      } else {
        alert('Failed to fetch tasks:', res.data);
      }
    }
    fetchTasks(); 
  },[])

  const [activeTab, setActiveTab] = useState('all'); // all | in-progress | completed | overdue
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const filteredTasks = useMemo(() => {
    if (activeTab === 'all') return tasks;
    return tasks.filter((t) => t.status === activeTab);
  }, [tasks, activeTab]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const overdue = tasks.filter((t) => t.status === 'overdue').length;
    return { total, inProgress, completed, overdue };
  }, [tasks]);

  const toggleComplete = (task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id
          ? {
              ...t,
              status: t.status === 'completed' ? 'open' : 'completed',
            }
          : t,
      ),
    );
  };

  const handleSaveNew = async(data) => {
    const res = await axios.post(`${API_URL}/tasks`, data, {
      withCredentials: true
    })
    if (res.status !== 201) {
      alert('Failed to create task:', res.data);
      return;
    }
    setTasks((prev) => [res.data, ...prev]);
    setShowAddModal(false);
  };

  const handleSaveEdit = async(data) => {
    const res = await axios.put(`${API_URL}/tasks/${data._id}`, data, {
      withCredentials: true,
    });
    if (res.status !== 200) {
      alert('Failed to update task');
      return;
    }
    setTasks((prev) => prev.map((t) => (t._id === data._id ? { ...t, ...res.data } : t)));
    setEditTask(null);
  };

  const handleDelete = async (task) => {
    if (!window.confirm('Delete this task?')) return;
    await axios.delete(`${API_URL}/tasks/${task._id}`, {
      withCredentials: true,
    });
    setTasks((prev) => prev.filter((t) => t._id !== task._id));
  };

  const handleChangePriority = async(id, priority) => {
    const res = await axios.patch(`${API_URL}/tasks/${id}`, { priority }, {
      withCredentials: true,
    });
    if (res.status !== 200) {
      alert('Failed to update priority:', res.data);
      return;
    }
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, priority } : t)));
  };

  const TabButton = ({ id, label }) => {
    const active = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={[
          'rounded-lg px-4 py-2 text-sm transition-all duration-200',
          active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white',
        ].join(' ')}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-[var(--page-fg)]">
      {/* Background elements */}
      <div className="bg-blob left" />
      <div className="bg-blob right" />
      <div className="floating-dots" />
      
      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <SidebarNav />

        {/* Main content */}
        <div className="flex min-h-screen flex-1 flex-col p-6 lg:pl-8">
        {/* Header */}
        <header>
          <h1 className="mb-2 text-3xl font-bold text-white">Tasks</h1>
          <p className="mb-8 text-lg text-gray-400">Manage your productivity tasks</p>
        </header>

        {/* Add task & tabs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-blue-600 hover:to-purple-700"
          >
            <div className="flex items-center gap-2">
              <FiPlus className="h-5 w-5" />
              <span>Add New Task</span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <TabButton id="all" label="All" />
            <TabButton id="in-progress" label="In Progress" />
            <TabButton id="completed" label="Completed" />
            <TabButton id="overdue" label="Overdue" />
          </div>
        </div>

        {/* Stats */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-gray-900 p-4 text-white">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="mt-1 text-sm text-gray-400">Total Tasks</div>
          </div>
          <div className="rounded-lg bg-gray-900 p-4 text-white">
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <div className="mt-1 text-sm text-gray-400">In Progress</div>
          </div>
          <div className="rounded-lg bg-gray-900 p-4 text-white">
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="mt-1 text-sm text-gray-400">Completed</div>
          </div>
          <div className="rounded-lg bg-gray-900 p-4 text-white">
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <div className="mt-1 text-sm text-gray-400">Overdue</div>
          </div>
        </section>

        {/* Tasks list */}
        <section>
          {filteredTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-800 p-8 text-center text-gray-400">
              No tasks in this view.
            </div>
          ) : (
            <div>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={toggleComplete}
                  onEdit={(t) => setEditTask(t)}
                  onDelete={handleDelete}
                  onChangePriority={handleChangePriority}
                />
              ))}
            </div>
          )}
        </section>
        </div>
      </div>

      {showAddModal && (
        <TaskModal mode="add" onClose={() => setShowAddModal(false)} onSave={handleSaveNew} />
      )}

      {editTask && (
        <TaskModal
          mode="edit"
          initial={editTask}
          onClose={() => setEditTask(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default TasksPage;