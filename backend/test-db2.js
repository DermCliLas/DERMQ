const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.gsyvzfkkqiucaeinyddc:DermqAdmin2026%21@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});
client.connect()
  .then(() => {
    console.log('Connected to Supabase DATABASE_URL (6543) successfully!');
    client.end();
  })
  .catch(err => {
    console.error('Connection error:', err.message);
  });
