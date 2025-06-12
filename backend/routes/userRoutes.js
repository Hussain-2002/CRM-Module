// routes/userRoutes.js
import express from 'express';
import { getSalesReps } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/users/sales-reps
router.get('/sales-reps', protect, getSalesReps);

export default router;
