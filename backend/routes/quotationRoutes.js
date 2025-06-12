import express from 'express';
import {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation
} from '../controllers/quotationController.js';
import { protect } from '../middleware/authMiddleware.js'; // ✅ import protect

const router = express.Router();

// @route   POST /api/quotations
// @desc    Create a new quotation (protected)
router.post('/', protect, createQuotation);

// @route   GET /api/quotations
router.get('/', protect, getAllQuotations);

// @route   GET /api/quotations/:id
router.get('/:id', protect, getQuotationById);

// @route   PUT /api/quotations/:id
router.put('/:id', protect, updateQuotation);

// @route   DELETE /api/quotations/:id
router.delete('/:id', protect, deleteQuotation);

export default router;
