const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const { cloudinary } = require('../cloudConfig');
const Listing = require('../models/listing');

const IMAGES_DIR = 'C:\\Users\\LOQ\\OneDrive\\Pictures\\AIRBNB DATA';
const OWNER_ID = '6a360260f43cc0752f8714aa';

const listingData = [
  {
    file: 'mountain.jpg',
    title: 'Alpine Chalet Retreat',
    description: 'A luxurious chalet nestled in the heart of the Swiss Alps with panoramic mountain views.',
    price: 4500,
    location: 'Swiss Alps',
    country: 'Switzerland',
    lat: 46.8182,
    lng: 8.2275,
  },
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
    file: 'pexels-photo-1643383.jpeg',
    title: 'Tropical Beach Villa',
    description: 'A stunning beachfront villa in Bali with private pool and lush tropical gardens.',
    price: 2800,
    location: 'Bali',
    country: 'Indonesia',
    lat: -8.4095,
    lng: 115.1889,
  },
  {
    file: 'pexels-photo-24032619.jpeg',
    title: 'Modern Tokyo Studio',
    description: 'Sleek modern studio in Shibuya, Tokyo with skyline views and top amenities.',
    price: 4000,
    location: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
  },
  {
    file: 'pexels-photo-261102.jpeg',
    title: 'Overwater Bungalow Paradise',
    description: 'An exclusive overwater bungalow in the Maldives with crystal-clear lagoon views.',
    price: 6000,
    location: 'Maldives',
    country: 'Maldives',
    lat: 3.2028,
    lng: 73.2207,
  },
  {
    file: 'pexels-photo-323705.jpeg',
    title: 'Manhattan Skyline Loft',
    description: 'A luxury loft in Manhattan with stunning skyline views and world-class amenities.',
    price: 5000,
    location: 'New York City',
    country: 'United States',
    lat: 40.7128,
    lng: -74.006,
  },
];

async function uploadToCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'AirbnbClone',
      allowedFormats: ['jpeg', 'png', 'jpg'],
    });
    return { url: result.secure_url, filename: result.public_id };
  } catch (err) {
    console.error('Cloudinary upload error:', err.message || err);
    throw err;
  }
}

async function seed() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log('Connected to MongoDB Atlas');

    for (const item of listingData) {
      const filePath = path.join(IMAGES_DIR, item.file);
      if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${item.file}, skipping...`);
        continue;
      }

      console.log(`Uploading ${item.file} to Cloudinary...`);
      const image = await uploadToCloudinary(filePath);
      console.log(`Uploaded: ${image.url}`);

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
      console.log(`Created listing: ${listing.title}`);
    }

    console.log('\nAll listings created successfully!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seed();
