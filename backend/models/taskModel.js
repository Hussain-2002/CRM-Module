import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  contact: {
    type: String,
    default: '',
  },
  account: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Deferred', 'Waiting for input'],
    default: 'Deferred',
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  reminder: {
    type: Boolean,
    default: false,
  },
  repeat: {
    type: String,
    enum: ['None', 'Daily', 'Weekly', 'Monthly', 'Yearly'],
    default: 'None',
  },
  description: {
    type: String,
    default: '',
  },
  assignedTo: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  image:{
    data: Buffer,
    contentType: String,
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
