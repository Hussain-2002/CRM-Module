import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/tasks', taskRoutes); 

app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
