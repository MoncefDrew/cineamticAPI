const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all sondages
router.get('/', async (req, res) => {
  try {
    console.log('Attempting to fetch all sondages...');
    
    const { data, error } = await supabase
      .from('sondage')
      .select('*')
      .order('ProjectionDate', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Sondages received:', data);
    res.json(data);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get this week's sondages
router.get('/this-week', async (req, res) => {
  try {
    console.log('Attempting to fetch this week\'s sondages...');
    
    // Calculate the start and end of the current week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('sondage')
      .select('*')
      .gte('ProjectionDate', startOfWeek.toISOString())
      .lte('ProjectionDate', endOfWeek.toISOString())
      .order('ProjectionDate', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('This week\'s sondages received:', data);
    res.json(data);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 