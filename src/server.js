const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const clientRoutes = require('./routes/clients');
const filmRoutes = require('./routes/films');
const sondageRoutes = require('./routes/sondages');
const projectionRoutes = require('./routes/projections');
const ticketRoutes = require('./routes/tickets');

// Use routes
app.use('/api/client', clientRoutes);
app.use('/api/film', filmRoutes);
app.use('/api/sondage', sondageRoutes);
app.use('/api/projection', projectionRoutes);
app.use('/api/ticket', ticketRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
