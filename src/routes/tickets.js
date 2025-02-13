const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.post('/', async (req, res) => {
    try {
      const { projection_id, username,seat } = req.body; // Use req.body instead of req.params for POST requests
  
      console.log('Attempting to reserve ticket');
  
      const { data, error } = await supabase
        .from('ticket')
        .insert([
          { projection_id, username,seat } // Pass an object inside an array
        ]);
  
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
  
      console.log('Ticket reserved:', data);
      res.status(201).json(data);
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ error: error.message });
    }
  });
  


module.exports = router; 