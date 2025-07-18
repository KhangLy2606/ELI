// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Import morgan
const apiRoutes = require('./api');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`[dotenv] injecting env variables.`); // Updated log message
    console.log(`Server is running on http://localhost:${port}`);
});