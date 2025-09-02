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
    if (user.provider === 'google') {
      return res.status(400).json({ message: 'Use Google Sign-In for this account' });
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

// Google Sign-In: takes Google ID token from frontend, verifies it, creates/updates user, sets cookie
let googleClient = null;
try {
  const { OAuth2Client } = require('google-auth-library');
  if (process.env.GOOGLE_CLIENT_ID) {
    googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
} catch (_) {
  // Package may be missing until installed; handler will guard below
}

const googleAuth = async (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'GOOGLE_CLIENT_ID not configured on server' });
    }
    if (!googleClient) {
      return res.status(500).json({ message: 'Google auth library not initialized. Install google-auth-library.' });
    }

    const { idToken } = req.body; // Google ID token from frontend
    if (!idToken) return res.status(400).json({ message: 'Missing idToken' });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) return res.status(400).json({ message: 'Google email not available' });

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new Google user
      user = new User({
        name: name || 'User',
        email,
        provider: 'google',
        googleId,
        image: picture || process.env.DEFAULT_PROFILE_PIC,
      });
      await user.save();
    } else if (user.provider === 'local') {
      // Convert local to google for same email (optional policy)
      user.provider = 'google';
      user.googleId = googleId;
      if (picture) user.image = picture;
      await user.save();
    }

    const token = issueAuthCookie(res, user._id);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ message: 'Invalid Google token', err: error.message });
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
  googleAuth,
  logout,
};
