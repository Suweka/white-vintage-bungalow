'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Check, User, Calendar, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getHousekeepingData } from '@/lib/admin-actions';

type TaskStatus = 'pending' | 'in-progress' | 'completed';

interface HousekeepingTask {
  id: string;
  roomName: string;
  title: string;
  description: string;
  assignedTo: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueAt: string | null;
}

export default function HousekeepingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchTasks() {
    setLoading(true);
    setError(false);
    const data = await getHousekeepingData();
    if (data) {
      setTasks(data);
    } else {
      setError(true);
    }
    setLoading(false);
  }

  useEffect(() => { fetchTasks(); }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':  return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'pending':    return 'bg-yellow-100 text-yellow-700';
      default:           return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':   return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low':    return 'text-green-600';
      default:       return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="text-red-500" size={40} />
        <p className="text-gray-600">Failed to load housekeeping tasks.</p>
        <button onClick={fetchTasks} className="px-4 py-2 bg-primary text-white rounded-lg">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Housekeeping</h1>
          <p className="text-gray-600">Manage cleaning tasks and staff assignments</p>
        </div>
        <button onClick={fetchTasks} className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by room, staff, or task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <div className="select-wrapper flex-1">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
              <Plus size={20} />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">
            {tasks.length === 0
              ? 'No housekeeping tasks yet. Tasks assigned via the Task Management system will appear here.'
              : 'No tasks match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{task.roomName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  )}
                </div>
                <div className={`text-sm font-bold ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </div>
              </div>

              {/* Staff and Date */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-700">{task.assignedTo}</span>
                </div>
                {task.dueAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-700">{new Date(task.dueAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {task.status !== 'completed' && (
                  <button className="flex-1 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
                    <Check size={18} />
                    <span>Mark Complete</span>
                  </button>
                )}
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit Task
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Total Tasks</p>
          <p className="text-3xl font-bold text-primary">{tasks.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">{tasks.filter(t => t.status === 'in-progress').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Completed</p>
          <p className="text-3xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</p>
        </div>
      </div>
    </div>
  );
}
