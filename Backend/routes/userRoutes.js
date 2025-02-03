const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const users = require("../models/Dashboard");
const protect = require("../middleware/authMiddleware");
const Dashboard = require("../models/Dashboard");
const router = express.Router();



// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Add a timestamp to the filename
  },
});

const upload = multer({ storage });

// Register a new user
router.post('/signup', upload.single('photo'), async (req, res) => {
  const { name, phone, email, password } = req.body;
  const photo = req.file;

  try {
    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Handle photo (Store file path instead of base64 string)
    let photoPath = null;
    if (photo) {
      photoPath = `/uploads/${photo.filename}`; // Store the file path
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user without manually setting the `id`
    const user = new User({
      name,
      phone,
      email,
      password: hashedPassword,  // Store hashed password
      photo: photoPath,  // Store photo path
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });

    res.status(201).json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get user data
router.post("/user", async (req, res) => {
	try {
	    // Log the incoming request body
	    console.log("Request Body:", req.body);
   
	    const { name, email, phone } = req.body;
   
	    // Validate that all required fields are provided
	    if (!name || !email || !phone) {
		 return res.status(400).json({
		     error: "All fields (name, email, phone) are required"
		 });
	    }
   
	    // Create the user object with validated data
	    const newUser = new Dashboard({
		 name,
		 email,
		 phone
	    });
   
	    // Log the new user object before saving
	    console.log("New User Object:", newUser);
   
	    // Save the new user to the database
	    const savedUser = await newUser.save();
   
	    // Send a success response with the saved user data
	    res.status(201).json(savedUser);
	} catch (error) {
	    // Log any database errors
	    console.log("Database Error:", error);
	    res.status(500).json({ error: "Failed to create user" });
	}
   });
   
   
// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users); // Send all users as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


router.get("/dashboard-user", async (req, res) => {
  try {
    const users = await Dashboard.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Delete a user by ID
router.delete('/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
