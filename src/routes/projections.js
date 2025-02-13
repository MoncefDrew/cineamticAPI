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


//get seats
router.get('/:id/seats', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('projection')
    .select('seats')
    .eq('projection_id', id);

  if (error) return res.status(500).send(error);
  res.json(data);
});



//reserve seat 
  router.post('/:id/seats', async (req, res) => {
    const { id } = req.params;
    const { seatIndex } = req.body;
  
    const { data: projectionData, error: fetchError } = await supabase
      .from('projection')
      .select('seats')
      .eq('projection_id', id)
      .single();
  
    if (fetchError) return res.status(500).send(fetchError);
  
    const seats = projectionData.seats;
    if (seats[seatIndex].reserved) return res.status(400).send("Seat already reserved");
  
    seats[seatIndex].reserved = true;
  
    const { error: updateError } = await supabase
      .from('projection')
      .update({ seats })
      .eq('projection_id', id);
  
    if (updateError) return res.status(500).send(updateError);
  
    res.send("Seat reserved successfully");
  });
module.exports = router; 