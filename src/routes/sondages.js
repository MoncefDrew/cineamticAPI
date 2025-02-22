const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all sondages with films and votes
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all sondages with films and votes...');
    
    const { data: sondages, error: sondageError } = await supabase
      .from('sondage')
      .select(`
        *,
        sondage_films (
          film_id,
          film (
            id,
            title,
            description,
            poster_url,
            genre,
            duration,
            directedBy,
            rating
          ),
          vote (
            vote_value
          )
        )
      `)
      .order('ProjectionDate', { ascending: false });

    if (sondageError) {
      console.error('Supabase error:', sondageError);
      throw sondageError;
    }

    // Transform the data to include vote counts and percentages
    const formattedSondages = sondages.map(sondage => {
      const filmsWithVotes = sondage.sondage_films.map(sf => {
        const voteCount = sf.vote?.length || 0;
        const totalVotes = sondage.sondage_films.reduce((acc, curr) => 
          acc + (curr.vote?.length || 0), 0);
        
        return {
          ...sf.film,
          votes: voteCount,
          votePercentage: totalVotes > 0 ? (voteCount / totalVotes * 100) : 0
        };
      });

      return {
        ...sondage,
        films: filmsWithVotes,
        totalVotes: filmsWithVotes.reduce((acc, film) => acc + film.votes, 0)
      };
    });

    console.log('Sondages processed successfully');
    res.json(formattedSondages);
  } catch (error) {
    console.error('Error processing sondages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get this week's sondages with films and votes
router.get('/this-week', async (req, res) => {
  try {
    console.log('Fetching this week\'s sondages with films and votes...');
    
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const { data: sondages, error: sondageError } = await supabase
      .from('sondage')
      .select(`
        *,
        sondage_films (
          film_id,
          film (
            id,
            title,
            description,
            poster_url,
            genre,
            duration,
            directedBy,
            rating
          ),
          vote (
            vote_value
          )
        )
      `)
      .gte('ProjectionDate', startOfWeek.toISOString())
      .lte('ProjectionDate', endOfWeek.toISOString())
      .order('ProjectionDate', { ascending: true });

    if (sondageError) {
      console.error('Supabase error:', sondageError);
      throw sondageError;
    }

    const formattedSondages = sondages.map(sondage => {
      const filmsWithVotes = sondage.sondage_films.map(sf => {
        const voteCount = sf.vote?.length || 0;
        const totalVotes = sondage.sondage_films.reduce((acc, curr) => 
          acc + (curr.vote?.length || 0), 0);
        
        return {
          ...sf.film,
          votes: voteCount,
          votePercentage: totalVotes > 0 ? (voteCount / totalVotes * 100) : 0
        };
      });

      return {
        ...sondage,
        films: filmsWithVotes,
        totalVotes: filmsWithVotes.reduce((acc, film) => acc + film.votes, 0)
      };
    });

    console.log('This week\'s sondages processed successfully');
    res.json(formattedSondages);
  } catch (error) {
    console.error('Error processing this week\'s sondages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single sondage by ID with films and votes
router.get('/:id', async (req, res) => {
  try {
    console.log(`Fetching sondage ${req.params.id} with details...`);
    
    const { data: sondage, error: sondageError } = await supabase
      .from('sondage')
      .select(`
        *,
        sondage_films (
          film_id,
          film (
            id,
            title,
            description,
            poster_url,
            genre,
            duration,
            directedBy,
            rating
          ),
          vote (
            vote_value
          )
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (sondageError) {
      console.error('Supabase error:', sondageError);
      throw sondageError;
    }

    if (!sondage) {
      return res.status(404).json({ error: 'Sondage not found' });
    }

    const filmsWithVotes = sondage.sondage_films.map(sf => {
      const voteCount = sf.vote?.length || 0;
      const totalVotes = sondage.sondage_films.reduce((acc, curr) => 
        acc + (curr.vote?.length || 0), 0);
      
      return {
        ...sf.film,
        votes: voteCount,
        votePercentage: totalVotes > 0 ? (voteCount / totalVotes * 100) : 0
      };
    });

    const formattedSondage = {
      ...sondage,
      films: filmsWithVotes,
      totalVotes: filmsWithVotes.reduce((acc, film) => acc + film.votes, 0)
    };

    console.log('Sondage details processed successfully');
    res.json(formattedSondage);
  } catch (error) {
    console.error('Error processing sondage details:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add vote to a film in a sondage
router.post('/:sondageId/vote', async (req, res) => {
  try {
    const { filmId, voteValue } = req.body;
    const { sondageId } = req.params;

    console.log(`Adding vote for film ${filmId} in sondage ${sondageId}...`);

    // First, verify the sondage_films relationship exists
    const { data: sondageFilm, error: verifyError } = await supabase
      .from('sondage_films')
      .select('*')
      .eq('sondage_id', sondageId)
      .eq('film_id', filmId)
      .single();

    if (verifyError || !sondageFilm) {
      throw new Error('Invalid sondage-film combination');
    }

    // Add the vote
    const { data: vote, error: voteError } = await supabase
      .from('vote')
      .insert([
        {
          sondage_id: sondageId,
          film_id: filmId,
          vote_value: voteValue || 1
        }
      ])
      .select()
      .single();

    if (voteError) {
      console.error('Supabase error:', voteError);
      throw voteError;
    }

    console.log('Vote added successfully');
    res.json(vote);
  } catch (error) {
    console.error('Error adding vote:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;