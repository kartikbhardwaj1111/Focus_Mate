const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./dataBase/database');
const route = require('./routes/route');
require('dotenv').config();

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  credentials: true,
}));

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use('/api', route);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
