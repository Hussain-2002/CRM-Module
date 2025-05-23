import React from 'react';

const TaskDetails = ({ task }) => {
  if (!task) return null;

  return (
    <div className="bg-white shadow rounded p-4 my-4">
      <h3 className="text-xl font-semibold mb-4">Task Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
        <p><strong>Owner Name:</strong> {task.ownerName}</p>
        <p><strong>Subject:</strong> {task.subject}</p>
        <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
        <p><strong>Contact:</strong> {task.contact || 'N/A'}</p>
        <p><strong>Account:</strong> {task.account || 'N/A'}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Reminder:</strong> {task.reminder ? 'Yes' : 'No'}</p>
        <p><strong>Repeat:</strong> {task.repeat}</p>
        <p className="sm:col-span-2"><strong>Description:</strong> {task.description}</p>
      </div>
    </div>
  );
};

export default TaskDetails;
