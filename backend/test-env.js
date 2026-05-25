require('dotenv').config();
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL start:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 10) : 'undefined');
