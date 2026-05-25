const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.gsyvzfkkqiucaeinyddc:DermqAdmin2026%21@aws-1-us-east-2.pooler.supabase.com:5432/postgres'
});
client.connect()
  .then(() => {
    console.log('Connected to Supabase DIRECT_URL (5432) successfully!');
    client.end();
  })
  .catch(err => {
    console.error('Connection error:', err.message);
  });
