// test-db.js
const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('Connected! Time:', res.rows[0]);
  }
  pool.end();
});
