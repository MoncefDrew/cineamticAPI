const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all clients
router.get('/', async (req, res) => {
  try {
    console.log('Attempting to fetch clients...');
    
    const { data, error } = await supabase
      .from('client')
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Data received:', data);
    res.json(data);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 