const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const isLoggedIn = require('../middleware/isLoggedIn');
const methodOverride = require('method-override');
router.use(methodOverride('_method'));
const multer =require('multer');
const {storage}=require('../cloudConfig');
const upload =multer({storage});


router.get('/',async (req,res)=>{
  const allListings=  await Listing.find({});
  res.render('listings/index.ejs',{allListings});
    })

    //CREATE LISTING ROUTE
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('listings/new.ejs');
})

    //SHOW ROUTE
router.get('/:id', async (req,res)=>{
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id)
            .populate('owner')
            .populate('reviews');

        if(!listing){
            return res.status(404).send("Listing not found");
        }

        res.render('listings/show.ejs', { listing, currentUser: req.user });
    } catch(err){
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
    res.render('listings/edit.ejs',{listing});
})

router.put('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true, runValidators: true });
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${updatedListing._id}`);
  } catch (err) {
    next(err);
  }
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
