const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Import routes
const playersRoutes = require('./routes/players');
app.use('/api', playersRoutes);

// Middleware
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
