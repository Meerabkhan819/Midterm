// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');

// Reuse the same schema and model
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
  image: { type: String },  // New field for image URL
});

const MenuItem = mongoose.model('MenuItem', menuSchema, 'menu_items');

async function seedData() {
  await mongoose.connect(process.env.MONGODB_URI);

  const items = [
    { name: 'Espresso', category: 'Hot Drinks', price: 800.50, inStock: true, image: 'https://img.freepik.com/free-photo/closeup-classic-fresh-espresso-served-dark-surface_1220-5375.jpg?semt=ais_hybrid&w=740&q=80' },
    { name: 'Cappuccino', category: 'Hot Drinks', price: 550.50, inStock: true, image: 'https://media.istockphoto.com/id/1045880988/photo/coffee-art-in-cup-closeup-of-hands-making-latte-art.jpg?s=612x612&w=0&k=20&c=dsQM2jUw-oz8CtaZYPiC0dL9uoOIH5Z86iH-UlTxYs0=' },
    { name: 'Latte', category: 'Hot Drinks', price: 900.00, inStock: true, image: 'https://columbiametro.com/wp-content/uploads/2018/10/Latte.jpg' },
    { name: 'Iced Coffee', category: 'Cold Drinks', price: 800.00, inStock: true, image: 'https://t3.ftcdn.net/jpg/03/16/01/48/360_F_316014817_EC1KN7mAD86ALYhhwGUUeSsQoJIVMtfQ.jpg' },
    { name: 'Croissant', category: 'Pastries', price: 700.50, inStock: true, image: 'https://www.shutterstock.com/image-photo/freshly-baked-raisin-danish-pastry-600nw-2511360437.jpg' },
    { name: 'Muffin', category: 'Pastries', price: 400.00, inStock: false, image: 'https://media.istockphoto.com/id/516688047/photo/homemade-autumn-pumpkin-muffin.jpg?s=612x612&w=0&k=20&c=wbzrNN3oX-F4Q1rZJAeDLH9EKJfnHk9yyaJqIJbkV_U=' },
  ];

  await MenuItem.insertMany(items);
  console.log('Sample data inserted');
  mongoose.disconnect();
}

seedData().catch((err) => console.error(err));