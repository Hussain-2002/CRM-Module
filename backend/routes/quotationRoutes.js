import express from 'express';
import {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
} from '../controllers/quotationController.js';

import { sendQuotationEmail } from '../controllers/emailController.js';
import { downloadQuotationPDF } from '../controllers/pdfController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Quotation CRUD
router.post('/', protect, createQuotation);
router.get('/', protect, getAllQuotations);
router.get('/:id', protect, getQuotationById);
router.put('/:id', protect, updateQuotation);
router.delete('/:id', protect, deleteQuotation);

// ✅ New: Send Quotation Email
router.post('/:quotationId/send-email', protect, sendQuotationEmail);

// ✅ New: Download Quotation PDF
router.get('/:quotationId/download-pdf', protect, downloadQuotationPDF);

export default router;
