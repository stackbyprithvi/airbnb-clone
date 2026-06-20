# Airbnb Clone

A full-stack Airbnb clone built with Node.js, Express, MongoDB, and EJS.

## Features
- User authentication (signup/login/logout) with Passport.js
- CRUD operations for listings
- Image uploads via Cloudinary
- Reviews and ratings
- Location search with geocoding
- Interactive maps with Stadia Maps

## Tech Stack
**Backend:** Node.js, Express 5, MongoDB (Mongoose)  
**Frontend:** EJS, Bootstrap 5  
**Auth:** Passport.js (passport-local-mongoose)  
**Storage:** Cloudinary (images), Connect-Mongo (sessions)

## Getting Started
```bash
# Install dependencies
npm install

# Set up environment variables in .env:
# ATLASDB_URL, CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET, STADIA_MAP_TOKEN

# Start the server
npm start
```

Visit `http://localhost:3000/listings`
