const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Middleware to authenticate JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.set("Cache-Control", "no-store");
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.set("Cache-Control", "no-store");
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Register a new user (for testing)
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.set("Cache-Control", "no-store");
      return res
        .status(400)
        .json({
          success: false,
          message: "Email, password, and name are required",
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.set("Cache-Control", "no-store");
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: "User",
      avatar: "images/avatars/avatar1.png",
      stats: {
        articlesRead: 12,
        tipsViewed: 8,
        profileCompletion: 80,
      },
    });

    await user.save();
    res.set("Cache-Control", "no-store");
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.set("Cache-Control", "no-store");
    res
      .status(500)
      .json({
        success: false,
        message: `Failed to register user: ${error.message}`,
      });
  }
};

// Login user and generate JWT
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.set("Cache-Control", "no-store");
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.set("Cache-Control", "no-store");
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.set("Cache-Control", "no-store");
    res.json({ success: true, token });
  } catch (error) {
    res.set("Cache-Control", "no-store");
    res
      .status(500)
      .json({ success: false, message: `Failed to login: ${error.message}` });
  }
};

// Fetch Profile
const fetchProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.set("Cache-Control", "no-store");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.set("Cache-Control", "no-store");
    res.json({
      success: true,
      name: user.name,
      email: user.email,
      bio: user.bio,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled,
      receiveNotifications: user.receiveNotifications,
      stats: user.stats,
    });
  } catch (error) {
    res.set("Cache-Control", "no-store");
    res
      .status(500)
      .json({
        success: false,
        message: `Failed to fetch profile: ${error.message}`,
      });
  }
};

// Save Profile
const saveProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      bio,
      phone,
      avatar,
      twoFactorEnabled,
      receiveNotifications,
      stats,
    } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      res.set("Cache-Control", "no-store");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate inputs
    if (!name || !email) {
      res.set("Cache-Control", "no-store");
      return res
        .status(400)
        .json({ success: false, message: "Name and email are required" });
    }
    if (bio && bio.length > 150) {
      res.set("Cache-Control", "no-store");
      return res
        .status(400)
        .json({
          success: false,
          message: "Bio must be 150 characters or less",
        });
    }
    if (phone && !/^\+?\d{1,4}[-.\s]?\d{1,14}$/.test(phone)) {
      res.set("Cache-Control", "no-store");
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number" });
    }

    // Check for duplicate email
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.set("Cache-Control", "no-store");
        return res
          .status(400)
          .json({
            success: false,
            message: "Email is already in use by another account",
          });
      }
    }

    // Update fields
    user.name = name;
    user.email = email;
    user.bio = bio || "";
    user.phone = phone || "";
    user.avatar = avatar || user.avatar;
    user.twoFactorEnabled =
      twoFactorEnabled !== undefined ? twoFactorEnabled : user.twoFactorEnabled;
    user.receiveNotifications =
      receiveNotifications !== undefined
        ? receiveNotifications
        : user.receiveNotifications;
    user.stats = stats || user.stats;

    // Calculate profile completion
    const fields = [user.name, user.email, user.bio, user.phone, user.avatar];
    const filled = fields.filter((field) => field && field.trim()).length;
    user.stats.profileCompletion = Math.round((filled / fields.length) * 100);

    await user.save();
    res.set("Cache-Control", "no-store");
    res.json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        bio: user.bio,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
        receiveNotifications: user.receiveNotifications,
        stats: user.stats,
      },
    });
  } catch (error) {
    res.set("Cache-Control", "no-store");
    res
      .status(500)
      .json({
        success: false,
        message: `Failed to save profile: ${error.message}`,
      });
  }
};

// Update Security Settings
const updateSecuritySettings = async (req, res) => {
  try {
    const { twoFactorEnabled, receiveNotifications } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      res.set("Cache-Control", "no-store");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.twoFactorEnabled = twoFactorEnabled;
    user.receiveNotifications = receiveNotifications;

    await user.save();
    res.set("Cache-Control", "no-store");
    res.json({ success: true });
  } catch (error) {
    res.set("Cache-Control", "no-store");
    res
      .status(500)
      .json({
        success: false,
        message: `Failed to update security settings: ${error.message}`,
      });
  }
};

// Delete Account
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      res.set("Cache-Control", "no-store");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.set("Cache-Control", "no-store");
    res.json({ success: true });
  } catch (error) {
    res.set("Cache-Control", "no-store");
    res
      .status(500)
      .json({
        success: false,
        message: `Failed to delete account: ${error.message}`,
      });
  }
};

module.exports = {
  authenticate,
  register,
  login,
  fetchProfile,
  saveProfile,
  updateSecuritySettings,
  deleteAccount,
};