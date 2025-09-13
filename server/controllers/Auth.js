const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const oneHourMs = 3600000;

const issueAuthCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const secure = process.env.NODE_ENV === 'production';
  const sameSite = secure ? 'None' : 'Lax';
  res.cookie('token', token, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: oneHourMs,
  });
  // Also return the token so clients may store it if desired
  return token;
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, provider: 'local' });

    await newUser.save();

    const token = issueAuthCookie(res, newUser._id);
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', err: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = issueAuthCookie(res, user._id);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', err: error.message });
  }
};



const logout = async (req, res) => {
  try {
    const secure = process.env.NODE_ENV === 'production';
    const sameSite = secure ? 'None' : 'Lax';
    res.clearCookie('token', { httpOnly: true, secure, sameSite });
    return res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging out', err: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
};
