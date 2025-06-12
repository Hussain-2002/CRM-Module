import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productName: String,
  description: String,
  quantity: Number,
  unitPrice: Number,
  discount: Number,
  tax: Number,
  subtotal: Number
}, { _id: false });

const versionSchema = new mongoose.Schema({
  versionNumber: Number,
  items: [itemSchema],
  totals: {
    totalBeforeTax: Number,
    taxAmount: Number,
    grandTotal: Number
  },
  updatedAt: { type: Date, default: Date.now },
  notes: String
}, { _id: false });

const quotationSchema = new mongoose.Schema({
  customer: {
    name: String,
    contact: String,
    email: String,
    billingAddress: String
  },
  quotationId: { type: String, unique: true },
  date: { type: Date, default: Date.now },
  validUntil: Date,
  currency: String,
  salesRep: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [itemSchema],
  totals: {
    totalBeforeTax: Number,
    taxAmount: Number,
    grandTotal: Number
  },
  discountType: { type: String, enum: ['None', 'PerItem', 'Global'], default: 'None' },
  globalDiscount: Number,
  taxType: String,
  terms: {
    payment: String,
    delivery: String,
    additionalNotes: String
  },
  attachments: [String], // file paths or URLs
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Accepted', 'Declined', 'Expired'],
    default: 'Draft'
  },
  versions: [versionSchema],
  activityLog: [{
    action: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    comment: String
  }]
}, { timestamps: true });

export default mongoose.model('Quotation', quotationSchema);
