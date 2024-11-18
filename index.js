const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productsRoutes = require('./routes/products');
const errorHandler = require('./middleware/errorHandler'); // Import error handler

require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/products', productsRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the TravelExperts API');
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
