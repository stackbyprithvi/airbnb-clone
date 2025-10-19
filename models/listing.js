const mongoose = require('mongoose');
const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
image: {
url:String,
filename:String
},

    price: Number,
    location: String,
    country: String,
lat: Number,   // latitude
lng: Number,   // longitude
  
    reviews: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});
module.exports = mongoose.model('Listing', listingSchema);