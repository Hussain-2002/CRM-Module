import Quotation from '../models/Quotation.js';
import mongoose from 'mongoose';

// Generate a unique Quotation ID (e.g., QTN-0001)
const generateQuotationId = async () => {
  const count = await Quotation.countDocuments();
  return `QTN-${String(count + 1).padStart(4, '0')}`;
};
export const createQuotation = async (req, res) => {
  try {
    const {
      customer,
      validUntil,
      currency,
      salesRep,
      items,
      terms,
      attachments,
      totals,
    } = req.body;

    if (!customer || !salesRep || !items || !totals || !req.user?._id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const quotationId = await generateQuotationId();

    const newQuotation = new Quotation({
      customer,
      validUntil,
      currency,
      salesRep: new mongoose.Types.ObjectId(salesRep),
      items,
      terms,
      attachments,
      totals,
      quotationId,
      createdBy: req.user._id,
      activityLog: [
        {
          action: 'Created',
          user: req.user._id,
          comment: 'Quotation created.'
        }
      ]
    });

    await newQuotation.save();
    res.status(201).json(newQuotation);
  } catch (err) {
    console.error('Quotation creation failed:', err);
    res.status(500).json({ error: 'Failed to create quotation', details: err.message });
  }
};


// Get all quotations
export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quotations' });
  }
};

// Get a single quotation
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });
    res.json(quotation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quotation' });
  }
};

// Update quotation with optional versioning
export const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });

    // Store current version before update
    quotation.versions.push({
      versionNumber: quotation.versions.length + 1,
      items: quotation.items,
      totals: quotation.totals,
      notes: req.body.versionNote || 'Edited quotation',
    });

    // Update fields
    Object.assign(quotation, req.body);

    quotation.activityLog.push({
      action: 'Updated',
      user: req.body.updatedBy || null,
      comment: req.body.versionNote || 'Quotation updated'
    });

    await quotation.save();
    res.json(quotation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quotation', details: err.message });
  }
};

// Delete quotation
export const deleteQuotation = async (req, res) => {
  try {
    const deleted = await Quotation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Quotation not found' });
    res.json({ message: 'Quotation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quotation' });
  }
};
