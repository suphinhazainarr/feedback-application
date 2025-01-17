const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:4200',  // Your Angular app's URL
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/performanceReviewDB')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schema and Model
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  password: { type: String },
  position: String,
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  eligibleForReview: { type: Boolean, default: false },  // New field
  reviews: [
    {
      reviewer: { type: String },
      comment: { type: String }
    }
  ],
});

const Employee = mongoose.model('Employee', EmployeeSchema);

// Signup Route
app.post('/api/signup', async (req, res) => {
  console.log("Received signup request:", req.body);

  const { name, password, position, role, eligibleForReview = false } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required' });
  }

  try {
    // Check if user exists (optional)
    const existingUser = await Employee.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const newEmployee = new Employee({ name, password, position, role, eligibleForReview });
    const savedEmployee = await newEmployee.save();

    res.status(201).json({
      message: 'Signup successful',
      user: { id: savedEmployee._id, name: savedEmployee.name, role: savedEmployee.role, eligibleForReview: savedEmployee.eligibleForReview },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
});

// Update Employee Eligibility (Admin Only)
app.put('/api/employees/:id/eligibility', async (req, res) => {
  const { id } = req.params;
  const { eligibleForReview } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    employee.eligibleForReview = eligibleForReview;
    await employee.save();

    res.json({ message: 'Eligibility updated successfully', employee });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update eligibility', details: err.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required' });
  }

  try {
    const user = await Employee.findOne({ name });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, role: user.role, eligibleForReview: user.eligibleForReview },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Middleware for authentication
const authenticate = async (req, res, next) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(401).json({ error: 'Missing username or password' });
  }

  try {
    const user = await Employee.findOne({ name, password });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Authentication error', details: err.message });
  }
};

// Admin-Only Route
app.get('/api/admin', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  res.json({ message: 'Welcome, Admin!' });
});

// Employee Route
app.get('/api/employee', authenticate, (req, res) => {
  if (req.user.role !== 'employee') {
    return res.status(403).json({ error: 'Access denied: Employees only' });
  }
  res.json({ message: 'Welcome, Employee!' });
});

// Get All Employees
app.get('/api/employees', async (req, res) => {
  try {
    // Fetch only employees, excluding admins
    const employees = await Employee.find({ role: 'employee' });

    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching employees', details: err.message });
  }
});



// Get All Employees with Reviews
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching employee', details: err.message });
  }
});

// Add New Employee
app.post('/api/employees', async (req, res) => {
  try {
    const { name, position, role, eligibleForReviewing } = req.body;

    if (!name || !position) {
      return res.status(400).json({ error: 'Name and position are required' });
    }

    const newEmployee = new Employee({ name, position, role, eligibleForReviewing });
    const savedEmployee = await newEmployee.save();

    res.status(201).json({ message: 'Employee added successfully', employee: savedEmployee });
  } catch (err) {
    res.status(500).json({ error: 'Error adding employee', details: err.message });
  }
});

// Update Employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) return res.status(404).json({ error: 'Employee not found' });

    res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (err) {
    res.status(500).json({ error: 'Error updating employee', details: err.message });
  }
});

// Delete Employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
      const employeeId = req.params.id.trim();  // Remove any unwanted characters like newline
      const result = await Employee.findByIdAndDelete(employeeId);

      if (!result) {
          return res.status(404).json({ error: "Employee not found" });
      }

      res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: "Error deleting employee", details: error.message });
  }
});




app.post('/api/employees/:employeeId/reviews', async (req, res) => {
  try {
      const { employeeId } = req.params;
      const { reviewer, comment } = req.body;

      const employee = await Employee.findById(employeeId);
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      // Add the review
      employee.reviews.push({ reviewer, comment });
      await employee.save();

      res.status(201).json(employee);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});


app.put('/api/employees/:employeeId/reviews/:reviewId', async (req, res) => {
  try {
      const { employeeId, reviewId } = req.params;
      const { comment } = req.body;

      // Find employee by ID
      const employee = await Employee.findById(employeeId);
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      // Find review inside employee
      const review = employee.reviews.id(reviewId);
      if (!review) {
          return res.status(404).json({ message: 'Review not found' });
      }

      // Update review
      review.comment = comment;
      await employee.save();

      res.status(200).json(employee);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});



app.delete('/api/employees/:employeeId/reviews/:reviewId', async (req, res) => {
  try {
      const { employeeId, reviewId } = req.params;

      // Find employee by ID
      const employee = await Employee.findById(employeeId);
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      // Find the review inside reviews array and remove it
      const reviewIndex = employee.reviews.findIndex(review => review._id.toString() === reviewId);
      if (reviewIndex === -1) {
          return res.status(404).json({ message: 'Review not found' });
      }

      // Remove the review from array
      employee.reviews.splice(reviewIndex, 1);
      await employee.save();

      res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});


app.put('/api/employees/:id', async (req, res) => {
  try {
    // Validate the request body for 'eligibleForReview'
    if (typeof req.body.eligibleForReview !== 'boolean') {
      return res.status(400).json({ message: "'eligibleForReview' must be a boolean value" });
    }

    // Find and update the employee by ID
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { eligibleForReview: req.body.eligibleForReview },
      { new: true } // Return the updated document
    );

    // Check if the employee was found and updated
    if (updatedEmployee) {
      res.json(updatedEmployee); // Return updated employee
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    // Handle any errors that occur
    if (err instanceof mongoose.Error.CastError) {
      // If the ID is invalid, return a 400 error
      return res.status(400).json({ message: 'Invalid employee ID' });
    }
    // For other errors, return a 500 server error
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


// Route to add a review for a specific employee
app.put('/api/employees/:id/add-review', async (req, res) => {
  try {
      const { id } = req.params; // Extract employee ID from URL
      const { reviewer, comment } = req.body; // Extract review data
      console.log('Received request:', req.params, req.body);

      // Find the employee by ID
      const employee = await Employee.findById(id);
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      console.log(comment);

      // Append the review to the employee's review list
      employee.reviews.push({ reviewer, comment });

      // Update eligibility status (if required)
      employee.eligibleForReview = false;

      console.log('Updated reviews:', employee.reviews);

      // Save the updated employee document
      await employee.save();

      res.status(200).json({ message: 'Review added successfully', employee });
  } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
