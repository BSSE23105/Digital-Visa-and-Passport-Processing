const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  price:  { type: Number,   required: true },
  quantity:  { type: Number,   required: true },
  category: { type: String, enum: ['Electronics','Clothing','Food'], required: true }
}, { timestamps: true }); 

module.exports = mongoose.model('newProduct', productSchema);
