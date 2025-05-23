import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  contact: {
    type: String, // Could later be changed to ObjectId referencing Contact
    default: ''
  },
  account: {
    type: String, // Could later be changed to ObjectId referencing Account
    default: ''
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Deferred', 'Waiting on someone else'],
    default: 'Not Started'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  reminder: {
    type: Boolean,
    default: false
  },
  repeat: {
    type: String,
    enum: ['None', 'Daily', 'Weekly', 'Monthly', 'Yearly'],
    default: 'None'
  },
  description: {
    type: String,
    default: ''
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
