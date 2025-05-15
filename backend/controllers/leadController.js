import Lead from '../models/lead.js';

// Create new lead
export const createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    const savedLead = await lead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bulk import leads
export const importLeads = async (req, res) => {
  try {
    const leads = req.body;
    if (!Array.isArray(leads)) {
      return res.status(400).json({ message: 'Data should be an array of leads.' });
    }

    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'companyName'];
    const invalidLeads = leads.filter(lead =>
      requiredFields.some(field => !lead[field] || lead[field].trim() === '')
    );

    if (invalidLeads.length > 0) {
      return res.status(400).json({
        message: `Import failed. ${invalidLeads.length} lead(s) missing required fields.`,
        missingFields: requiredFields
      });
    }

    const savedLeads = await Lead.insertMany(leads);
    res.status(201).json({ message: `${savedLeads.length} leads imported successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to import leads', error: error.message });
  }
};

// Get all leads (optionally filtered)
export const getLeads = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const leads = await Lead.find(query);
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get lead by ID
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update lead
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete lead
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 Pie chart: Get lead analytics data (status distribution)
export const getLeadStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();

    const statusCounts = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusSummary = {};
    statusCounts.forEach(item => {
      statusSummary[item._id || 'unknown'] = item.count;
    });

    res.status(200).json({
      totalLeads,
      statusCounts: statusSummary
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get stats', error: error.message });
  }
};

// 📊 Bar chart: Get yearly and monthly trends
export const getLeadTrends = async (req, res) => {
  try {
    const yearly = await Lead.aggregate([
      {
        $group: {
          _id: { $year: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const monthly = await Lead.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      yearly,
      monthly
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get lead trends', error: error.message });
  }
};
