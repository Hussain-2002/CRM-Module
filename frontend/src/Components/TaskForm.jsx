import { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    ownerName: '',
    subject: '',
    dueDate: '',
    contact: '',
    account: '',
    status: 'Not Started',
    priority: 'Medium',
    reminder: false,
    repeat: 'None',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.ownerName || !formData.subject || !formData.dueDate) {
      alert('Please fill in all required fields: Owner Name, Subject, Due Date');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/tasks', formData);
      onTaskCreated();
      setFormData({
        ownerName: '',
        subject: '',
        dueDate: '',
        contact: '',
        account: '',
        status: 'Not Started',
        priority: 'Medium',
        reminder: false,
        repeat: 'None',
        description: '',
      });
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Please check the input data.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded-xl mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Text Inputs */}
        {[
          { name: 'ownerName', label: 'Owner Name' },
          { name: 'subject', label: 'Subject' },
          { name: 'dueDate', label: 'Due Date', type: 'date' },
          { name: 'contact', label: 'Contact' },
          { name: 'account', label: 'Account' },
        ].map(({ name, label, type = 'text' }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}

        {/* Dropdowns */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg shadow-sm"
          >
            {['Not Started', 'In Progress', 'Completed', 'Deferred', 'Waiting on someone else'].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg shadow-sm"
          >
            {['High', 'Medium', 'Low'].map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Repeat</label>
          <select
            name="repeat"
            value={formData.repeat}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg shadow-sm"
          >
            {['None', 'Daily', 'Weekly', 'Monthly', 'Yearly'].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Reminder (Checkbox) */}
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            name="reminder"
            checked={formData.reminder}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">Set Reminder</label>
        </div>

        {/* Description */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 text-right">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
