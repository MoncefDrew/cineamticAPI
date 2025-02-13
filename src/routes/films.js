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

// get the feauted movie
router.get('/featured', async (req,res)=>{
  try {
    // Fetch the latest movie from the database
    const { data, error } = await supabase
        .from('film') // Replace with your table name
        .select('*')
        .order('created_at', { ascending: false }) // Sort by release date (newest first)
        .limit(1) // Get only the latest movie
        .single(); // Return a single object instead of an array

    if (error) {
        throw error;
    }

    if (!data) {
        return res.status(404).json({ message: 'No movies found' });
    }

    // Return the latest movie as the featured movie
    res.status(200).json({ featuredMovie: data });
} catch (error) {
    console.error('Error fetching featured movie:', error);
    res.status(500).json({ message: 'Internal Server Error' });
}
})
module.exports = router; 