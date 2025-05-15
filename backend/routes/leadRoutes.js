import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  importLeads,
  getLeadStats,
  getLeadTrends
} from '../controllers/leadController.js';

const router = express.Router();

// Core lead routes
router.get('/', getLeads);
router.post('/', createLead);
router.post('/import', importLeads);

// Analytics
router.get('/stats', getLeadStats);
router.get('/bar-stats', getLeadTrends); // ✅ Match Dashboard.jsx route

// CRUD by ID
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
