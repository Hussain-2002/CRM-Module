import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  importLeads,
  getLeadStats,
  getLeadTrends,
  getLeadMetrics,
  getMonthlyMetrics // ⬅️ newly added
} from '../controllers/leadController.js';

const router = express.Router();

// Core lead routes
router.get('/', getLeads);
router.post('/', createLead);
router.post('/import', importLeads);

// Analytics routes
router.get('/stats', getLeadStats);
router.get('/bar-stats', getLeadTrends); 
router.get('/metrics', getLeadMetrics);
router.get('/monthly-metrics', getMonthlyMetrics); // ✅ new route

// CRUD routes by ID
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
