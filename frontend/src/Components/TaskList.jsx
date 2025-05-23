import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Save, X } from 'lucide-react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditTaskId(task._id);
    setEditForm({ ...task });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${editTaskId}`, editForm);
      fetchTasks();
      setEditTaskId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {tasks.map((task) => (
        <div key={task._id} className="bg-white rounded-2xl shadow p-4">
          {editTaskId === task._id ? (
            <>
              <input
                name="subject"
                value={editForm.subject}
                onChange={handleChange}
                className="w-full mb-2 border p-1 rounded"
              />
              <input
                name="dueDate"
                type="date"
                value={editForm.dueDate?.slice(0, 10)}
                onChange={handleChange}
                className="w-full mb-2 border p-1 rounded"
              />
              <input
                name="ownerName"
                value={editForm.ownerName}
                onChange={handleChange}
                className="w-full mb-2 border p-1 rounded"
              />
              <select
                name="status"
                value={editForm.status}
                onChange={handleChange}
                className="w-full mb-2 border p-1 rounded"
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Deferred</option>
              </select>
              <div className="flex justify-end space-x-2 mt-2">
                <button onClick={handleSave} className="text-green-600">
                  <Save />
                </button>
                <button onClick={() => setEditTaskId(null)} className="text-red-600">
                  <X />
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-bold text-lg mb-1">{task.subject}</h2>
              <p className="text-sm mb-1"><strong>Owner:</strong> {task.ownerName}</p>
              <p className="text-sm mb-1"><strong>Due:</strong> {task.dueDate?.slice(0, 10)}</p>
              <p className="text-sm mb-1"><strong>Status:</strong> {task.status}</p>
              <p className="text-sm text-gray-600">{task.description}</p>
              <div className="flex justify-end space-x-2 mt-3">
                <button onClick={() => handleEdit(task)} className="text-blue-600">
                  <Pencil />
                </button>
                <button onClick={() => handleDelete(task._id)} className="text-red-600">
                  <Trash2 />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
