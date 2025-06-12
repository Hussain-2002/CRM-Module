// controllers/userController.js
import User from '../models/User.js';

// @desc    Get all users with role 'salesrep'
// @route   GET /api/users/sales-reps
// @access  Private (you can protect it later)
export const getSalesReps = async (req, res) => {
  try {
    const salesReps = await User.find({ role: 'salesrep' }).select('-password');
    res.json(salesReps);
  } catch (error) {
    console.error('Error fetching sales reps:', error);
    res.status(500).json({ message: 'Server error fetching sales reps' });
  }
};
