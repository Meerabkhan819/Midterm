// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all origins (simpler for APKs)
app.use(express.json());

// MongoDB Connection
// We use a cached connection for serverless performance
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('MongoDB connection failed:', err);
  }
};

// Connect to DB immediately
connectDB();

// Menu Schema
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
  image: { type: String },
});

const MenuItem = mongoose.model('MenuItem', menuSchema, 'menu_items');

// Root Endpoint (Good for testing if server is up)
app.get('/', (req, res) => {
  res.send('Coffee Shop API is running!');
});

// Endpoints
app.get('/menu', async (req, res) => {
  await connectDB(); // Ensure DB is connected
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

app.get('/menu/random', async (req, res) => {
  await connectDB(); // Ensure DB is connected
  try {
    const randomItem = await MenuItem.aggregate([
      { $match: { inStock: true } },
      { $sample: { size: 1 } },
    ]);
    if (randomItem.length === 0) {
      return res.status(404).json({ error: 'No items in stock' });
    }
    res.json(randomItem[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch random item' });
  }
});

// Start Server (Only for local development)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Coffee shop server running on port ${port}`);
  });
}

// Export the app for Vercel
module.exports = app;