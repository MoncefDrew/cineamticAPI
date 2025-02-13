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

//get single client with its ticket
router.get('/:id', async (req, res) => {
  try {
    const clientId = req.params.id;
    console.log('Attempting to retrieve data for client ID:', clientId);

    // Fetch client data
    const { data: clientData, error: clientError } = await supabase
      .from('client')
      .select('*')
      .eq('username', clientId)
      .single();

    if (clientError) {
      console.error('Error fetching client data:', clientError);
      return res.status(400).json({ error: clientError.message });
    }

    // Fetch tickets associated with the client
    const { data: ticketData, error: ticketError } = await supabase
      .from('ticket')
      .select('*')
      .eq('username', clientId);

    if (ticketError) {
      console.error('Error fetching ticket data:', ticketError);
      return res.status(400).json({ error: ticketError.message });
    }

    // Return combined result
    res.json({ client: clientData, tickets: ticketData });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: error.message });
  }
});




// get tickets for one client
router.get('/:id/tickets', async (req, res) => {
  try {
    const clientId = req.params.id;
    console.log('Attempting to retrieve tickets for client ID:', clientId);

    // Fetch tickets associated with the client, including projection and film data
    const { data: ticketData, error: ticketError } = await supabase
      .from('ticket')
      .select(`
        *,
        projection:projection_id (
          film_id,
          projection_date,
          start_time,
          duration,
          poster_url,
          film:film_id (
            title
          )
        )
      `)
      .eq('username', clientId);

    if (ticketError) {
      console.error('Error fetching ticket data:', ticketError);
      return res.status(400).json({ error: ticketError.message });
    }

    // Check if we have any tickets
    if (!ticketData || ticketData.length === 0) {
      return res.json({ tickets: [] });
    }

    // Return the tickets with embedded projection and film data
    res.json({ tickets: ticketData });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 