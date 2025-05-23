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
    const statuses = ['converted', 'contacted', 'qualified', 'unqualified', 'new'];
    const statusCounts = {};

    for (const status of statuses) {
      statusCounts[status] = await Lead.countDocuments({ status });
    }

    res.status(200).json({
      totalLeads,
      ...statusCounts
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get stats', error: error.message });
  }
};

// 📊 Bar chart: Enhanced trends with date filtering and status grouping
export const getLeadTrends = async (req, res) => {
  try {
    const { startDate, endDate, type = 'year' } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Group by status + date
    const groupId = type === 'month'
      ? { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, status: '$status' }
      : { year: { $year: '$createdAt' }, status: '$status' };

    const aggregationPipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: groupId,
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          ...(type === 'month' ? { '_id.month': 1 } : {}),
          '_id.status': 1,
        },
      },
    ];

    const results = await Lead.aggregate(aggregationPipeline);

    // Extract unique labels and statuses
    const labelsSet = new Set();
    const statusesSet = new Set();

    results.forEach(({ _id }) => {
      const { year, month, status } = _id;
      const label = type === 'month' ? `${year}-${String(month).padStart(2, '0')}` : `${year}`;
      labelsSet.add(label);
      statusesSet.add(status);
    });

    const labels = Array.from(labelsSet).sort();
    const statuses = Array.from(statusesSet);

    // Initialize datasets
    const datasets = {};
    statuses.forEach(status => {
      datasets[status] = new Array(labels.length).fill(0);
    });

    // Fill datasets with actual data
    results.forEach(({ _id, count }) => {
      const { year, month, status } = _id;
      const label = type === 'month' ? `${year}-${String(month).padStart(2, '0')}` : `${year}`;
      const index = labels.indexOf(label);
      if (index !== -1) {
        datasets[status][index] = count;
      }
    });

    // Calculate total per status
    const totalPerStatus = {};
    statuses.forEach(status => {
      totalPerStatus[status] = datasets[status].reduce((sum, val) => sum + val, 0);
    });

    res.status(200).json({
      labels,
      datasets,
      totalPerStatus
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get lead trends', error: error.message });
  }
};
