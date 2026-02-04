'use client';

import React, { useState } from 'react';
import { Search, Plus, Check, Clock, AlertCircle, User, Calendar } from 'lucide-react';

type TaskStatus = 'pending' | 'in-progress' | 'completed';

interface HousekeepingTask {
  id: string;
  roomNumber: string;
  roomName: string;
  taskType: string;
  assignedTo: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  checklist: { item: string; completed: boolean }[];
}

export default function HousekeepingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  const tasks: HousekeepingTask[] = [
    {
      id: 'HK001',
      roomNumber: '101',
      roomName: 'Deluxe Room',
      taskType: 'Full Clean',
      assignedTo: 'Maria Garcia',
      status: 'completed',
      priority: 'high',
      dueDate: '2025-12-14',
      checklist: [
        { item: 'Dust all surfaces', completed: true },
        { item: 'Vacuum floors', completed: true },
        { item: 'Clean bathroom', completed: true },
        { item: 'Change bedsheets', completed: true },
      ],
    },
    {
      id: 'HK002',
      roomNumber: '202',
      roomName: 'Junior Suite',
      taskType: 'Maintenance Clean',
      assignedTo: 'John Smith',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2025-12-14',
      checklist: [
        { item: 'Spot clean carpet', completed: true },
        { item: 'Clean windows', completed: false },
        { item: 'Replenish toiletries', completed: false },
      ],
    },
    {
      id: 'HK003',
      roomNumber: '303',
      roomName: 'Family Room',
      taskType: 'Full Clean',
      assignedTo: 'Rosa Lopez',
      status: 'pending',
      priority: 'high',
      dueDate: '2025-12-14',
      checklist: [
        { item: 'Dust all surfaces', completed: false },
        { item: 'Vacuum floors', completed: false },
        { item: 'Clean kitchen', completed: false },
        { item: 'Change bedsheets', completed: false },
      ],
    },
    {
      id: 'HK004',
      roomNumber: '104',
      roomName: 'Deluxe Room',
      taskType: 'Quick Clean',
      assignedTo: 'Maria Garcia',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2025-12-14',
      checklist: [
        { item: 'Tidy up room', completed: true },
        { item: 'Restock amenities', completed: true },
      ],
    },
    {
      id: 'HK005',
      roomNumber: '401',
      roomName: 'Executive Suite',
      taskType: 'Full Clean',
      assignedTo: 'John Smith',
      status: 'pending',
      priority: 'high',
      dueDate: '2025-12-15',
      checklist: [
        { item: 'Deep clean all areas', completed: false },
        { item: 'Polish furniture', completed: false },
        { item: 'Premium toiletries', completed: false },
      ],
    },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Housekeeping</h1>
        <p className="text-gray-600">Manage cleaning tasks and staff assignments</p>
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
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
              <Plus size={20} />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const completedItems = task.checklist.filter(item => item.completed).length;
          const totalItems = task.checklist.length;
          const progress = (completedItems / totalItems) * 100;

          return (
            <div key={task.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Room #{task.roomNumber} - {task.roomName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{task.taskType}</p>
                </div>
                <div className={`text-lg font-bold ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </div>
              </div>

              {/* Staff and Date */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-700">{task.assignedTo}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-700">{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Task Progress</p>
                  <span className="text-sm font-semibold text-primary">{completedItems}/{totalItems}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Checklist */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Checklist</p>
                <div className="space-y-2">
                  {task.checklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        className="w-4 h-4 rounded border-gray-300"
                        readOnly
                      />
                      <span className={`text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {item.item}
                      </span>
                    </div>
                  ))}
                </div>
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
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found</p>
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
