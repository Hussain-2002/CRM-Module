import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
import taskRoutes from './routes/taskRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// API Routes
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/tasks', taskRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/users', userRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
