import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || 'supersecureadmin2025';

export const register = async (req, res) => {
  try {
    let {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      password,
      confirmPassword,
      role,
      adminSecretCode,
    } = req.body;

    // Trim inputs
    firstName = firstName?.trim();
    middleName = middleName?.trim();
    lastName = lastName?.trim();
    phoneNumber = phoneNumber?.trim();
    email = email?.trim().toLowerCase();
    role = role?.trim().toLowerCase();

    // Validate required fields
    if (!firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Validate role and admin secret if needed
    if (role === 'admin') {
  if (!adminSecretCode) {
    return res.status(400).json({ message: 'Admin secret code is required for admin registration' });
  }
  if (adminSecretCode !== ADMIN_SECRET_CODE) {
    return res.status(403).json({ message: 'Invalid admin secret code' });
  }
} else if (role === 'salesrep') {
  // no special validation needed for salesrep
} else {
  role = 'user'; // fallback only if role is not admin or salesrep
}


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
