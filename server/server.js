// ELI/server/server.js

const express = require('express');
const cors = require('cors');
const config = require('./config');
const apiRoutes = require('./api');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});
