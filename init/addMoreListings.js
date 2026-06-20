require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { cloudinary } = require('../cloudConfig');
const Listing = require('../models/listing');

const OWNER_ID = '6a360260f43cc0752f8714aa';
const IMAGES_DIR = 'C:\\Users\\LOQ\\OneDrive\\Pictures\\AIRBNB DATA';

const newListings = [
  {
    file: 'pexels-photo-1619311.jpeg',
    title: 'Charming Parisian Apartment',
    description: 'Stay in a cozy apartment in the heart of Paris, steps from the Eiffel Tower.',
    price: 3500,
    location: 'Paris',
    country: 'France',
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    title: 'Sydney Harbour House',
    description: 'Luxurious waterfront home with stunning views of the Sydney Opera House and Harbour Bridge.',
    price: 4200,
    location: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
  },
  {
    title: 'Dubai Marina Penthouse',
    description: 'Ultra-modern penthouse in Dubai Marina with panoramic city and sea views.',
    price: 5500,
    location: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.2048,
    lng: 55.2708,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
  },
  {
    title: 'Rio Beachfront Villa',
    description: 'Vibrant beachfront villa in Rio with stunning views of Sugarloaf Mountain.',
    price: 3200,
    location: 'Rio de Janeiro',
    country: 'Brazil',
    lat: -22.9068,
    lng: -43.1729,
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',
  },
  {
    title: 'Santorini Cave Suite',
    description: 'Iconic white-washed cave suite in Santorini with breathtaking sunset views.',
    price: 4800,
    location: 'Santorini',
    country: 'Greece',
    lat: 36.3932,
    lng: 25.4615,
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
  },
  {
    title: 'Bangkok Riverside Retreat',
    description: 'Serene riverside retreat in Bangkok with traditional Thai architecture.',
    price: 2200,
    location: 'Bangkok',
    country: 'Thailand',
    lat: 13.7563,
    lng: 100.5018,
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
  },
  {
    title: 'Cape Town Cliffside Villa',
    description: 'Stunning cliffside villa in Cape Town overlooking the Atlantic Ocean and Table Mountain.',
    price: 3800,
    location: 'Cape Town',
    country: 'South Africa',
    lat: -33.9249,
    lng: 18.4241,
    imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800',
  },
];

async function uploadToCloudinary(filePath) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'AirbnbClone',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  });
  return { url: result.secure_url, filename: result.public_id };
}

async function addListings() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log('Connected to MongoDB Atlas');

    for (const item of newListings) {
      let image;

      if (item.file) {
        const filePath = path.join(IMAGES_DIR, item.file);
        if (!fs.existsSync(filePath)) {
          console.log(`File not found: ${item.file}, skipping...`);
          continue;
        }
        console.log(`Uploading ${item.file} to Cloudinary...`);
        image = await uploadToCloudinary(filePath);
      } else {
        image = { url: item.imageUrl, filename: item.title.toLowerCase().replace(/\s+/g, '-') };
      }

      const listing = new Listing({
        title: item.title,
        description: item.description,
        image,
        price: item.price,
        location: item.location,
        country: item.country,
        lat: item.lat,
        lng: item.lng,
        owner: OWNER_ID,
      });

      await listing.save();
      console.log(`Created: ${listing.title}`);
    }

    const count = await Listing.countDocuments({});
    console.log(`\nDone! Total listings now: ${count}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

addListings();
