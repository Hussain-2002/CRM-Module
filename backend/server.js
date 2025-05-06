import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', leadRoutes);

// Catch-all for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
