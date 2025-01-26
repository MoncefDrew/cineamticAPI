const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all projections
router.get('/', async (req, res) => {
  try {
    console.log('Attempting to fetch all projections...');
    
    const { data, error } = await supabase
      .from('projection')
      .select('*')
      .order('projection_date', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Projections received:', data);
    res.json(data);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 