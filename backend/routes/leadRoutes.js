import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  importLeads // ✅ import the new bulk import controller
} from '../controllers/leadController.js';

const router = express.Router();

// Route: /api/leads
router.get('/', getLeads);          // Get all leads or filtered
router.post('/', createLead);       // Create a new lead

// 🔄 Bulk import route
router.post('/import', importLeads); // ✅ Add bulk import route

// Route: /api/leads/:id
router.get('/:id', getLeadById);    // Get lead by ID
router.put('/:id', updateLead);     // Update lead by ID
router.delete('/:id', deleteLead);  // Delete lead by ID

export default router;
