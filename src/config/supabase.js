const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Debug the environment variables
console.log('Environment Variables Check:');
console.log('SUPABASE_URL:', supabaseUrl || 'not set');
console.log('SUPABASE_ANON_KEY:', supabaseKey ? 'exists' : 'not set');

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; 