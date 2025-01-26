const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all films
router.get('/', async (req, res) => {
  try {
    console.log('Attempting to fetch films...');
    
    const { data, error } = await supabase
      .from('film')  // assuming your table name is 'film'
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Films received:', data);
    res.json(data);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get top 10 rated films
router.get('/popular', async (req, res) => {
  try {
    console.log('Attempting to fetch top 10 rated films...');
    
    const { data, error } = await supabase
      .from('film')
      .select('*')
      .order('rating', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Top rated films received:', data);
    res.json(data);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 