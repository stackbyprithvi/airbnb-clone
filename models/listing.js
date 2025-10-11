const mongoose = require('mongoose');
const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
image: {
  type: String,
  default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3...",
  set: v => !v || v.trim() === "" 
        ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3..." 
        : v,
},

    price: Number,
    location: String,
    country: String,
    reviews: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});
module.exports = mongoose.model('Listing', listingSchema);