// src/pages/TaskPage.jsx
import React, { useState, useEffect } from 'react';
import TaskForm from '../Components/TaskForm';
import TaskList from '../Components/TaskList';
import TaskDetails from '../Components/TaskDetails';
import axios from 'axios';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  const handleCreate = () => {
    setTaskToEdit(null);
    setShowForm(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskToEdit) {
        await axios.put(`http://localhost:5000/api/tasks/${taskToEdit._id}`, taskData);
      } else {
        await axios.post('http://localhost:5000/api/tasks', taskData);
      }
      fetchTasks();
      setShowForm(false);
      setTaskToEdit(null);
    } catch (err) {
      console.error('Error saving task', err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      fetchTasks();
      setSelectedTask(null);
    } catch (err) {
      console.error('Error deleting task', err);
    }
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setShowForm(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleSaveTask}
          taskToEdit={taskToEdit}
          onCancel={() => {
            setShowForm(false);
            setTaskToEdit(null);
          }}
        />
      )}

      <TaskList
        tasks={tasks}
        onSelect={setSelectedTask}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {selectedTask && (
        <div className="mt-6">
          <TaskDetails task={selectedTask} />
        </div>
      )}
    </div>
  );
};

export default TaskPage;
