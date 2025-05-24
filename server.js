const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://eren:Narutoop9@cluster0.yuxdo.mongodb.net/RyuuApp?retryWrites=true&w=majority")
  .then(() => console.log('MongoDB connected'));

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
