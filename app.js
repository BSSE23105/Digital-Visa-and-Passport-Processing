const express = require('express');
const path    = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

const app = express();
app.use(express.json());

app.use('/api/visas',     require('./routes/visaRoutes'));
app.use('/api/passports', require('./routes/passportRoutes'));

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

module.exports = app;