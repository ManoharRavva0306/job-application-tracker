const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Built-in Middleware for JSON and CORS
app.use(cors());
app.use(express.json());

// Health check test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Job Application Tracker API is running' });
});

// Request Logger (add this right before app.use('/api/auth', ...))
app.use((req, res, next) => {
  console.log(`👉 [${req.method}] ${req.originalUrl}`);
  next();
});

// All API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ message: `Resource not found at ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});