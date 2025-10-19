const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const isLoggedIn = require('../middleware/isLoggedIn');
const methodOverride = require('method-override');
router.use(methodOverride('_method'));
const multer =require('multer');
const {storage}=require('../cloudConfig');
const upload =multer({storage});
const fetch = require('node-fetch');




router.get('/',async (req,res)=>{
  const allListings=  await Listing.find({});
  res.render('listings/index.ejs',{allListings});
    })

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || "";
    const listings = await Listing.find({
      $or: [
        { location: { $regex: query, $options: 'i' } },
        { country: { $regex: query, $options: 'i' } }
      ]
    });

    res.render('listings/index', { allListings: listings });
  } catch (err) {
    console.error(err);
    res.redirect('/listings');
  }
});





    //CREATE LISTING ROUTE
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('listings/new.ejs');
})

// SHOW ROUTE with Stadia Maps geocoding
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate('owner')
      .populate('reviews');

    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    // Geocode the location string using Stadia Maps API
    const geoUrl = `https://api.stadiamaps.com/geocoding/v1/search?api_key=${process.env.STADIA_MAP_TOKEN}&text=${encodeURIComponent(listing.location)}`;

    let lat = 27.7172; // fallback to Kathmandu
    let lng = 85.3240;

    try {
      const response = await fetch(geoUrl);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        lng = data.features[0].geometry.coordinates[0];
        lat = data.features[0].geometry.coordinates[1];
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      // fallback coordinates will be used
    }

    res.render('listings/show.ejs', { 
      listing, 
      currentUser: req.user,
      mapToken: process.env.STADIA_MAP_TOKEN,   // STADIA MAPS TOKEN
      lat,
      lng
    });
  } catch (err) {
    console.error("Show route error:", err);
    res.status(500).send("Something went wrong!!");
  }
});



router.post('/', upload.single('listing[image]'), async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);

    // Set the owner to the currently logged-in user
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = {
        url: req.file.path,      // full Cloudinary URL
        filename: req.file.filename
      };
    }

    await newListing.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect('/listings');
  } catch (err) {
    console.error("Error uploading image:", err);
    next(err);
  }
});



//EDIT LISTING ROUTE
router.get('/:id/edit',isLoggedIn,async (req,res)=>{
        const {id}=req.params;
    const listing=await Listing.findById(id);
    let originalImage=listing.image.url;
    originalImage=originalImage.replace('/upload/','/upload/w_300/');
    listing.image.url=originalImage;

    res.render('listings/edit.ejs',{listing});
})

router.put('/:id',upload.single('listing[image]'), isLoggedIn, async (req, res, next) => {
  const  {id} = req.params;
  let listing = await Listing.findById(id);

  if(req.file){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
  }

  if (req.body.listing) {
      const { price, title, description } = req.body.listing;
      if (price !== undefined) listing.price = price;
      if (title !== undefined) listing.title = title;
      if (description !== undefined) listing.description = description;
    }
    await listing.save();
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${id}`);

/*
if(typeof req.file !== 'undefined'){
 let url=req.file.path;
 let filename=req.file.filename;
 listing.image={url,filename};
 await listing.save();
}
 */
});


//DELETE LISTING ROUTE
router.delete('/:id',isLoggedIn,async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
})
router.use((err,req,res,next)=>{
    res.status(500).send("Something went wrong!!");
});





module.exports=router;
