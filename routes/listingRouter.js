const express=require('express');
const router=require('express').Router();
const Listing=require('../models/listing');
const isLoggedIn=require('../middleware/isLoggedIn');

router.get('/',async (req,res)=>{
  const allListings=  await Listing.find({});
  res.render('listings/index.ejs',{allListings});
    })

    //CREATE LISTING ROUTE
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('listings/new.ejs');
})

    //SHOW ROUTE
router.get('/:id',async (req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).populate('reviews');
    res.render('listings/show.ejs',{listing});
})

router.post('/',async (req,res,next)=>{
    try{
        
        const newListing= new Listing(req.body.listing);
        await newListing.save();
        res.redirect('/listings');
    }
    catch(err){
        next(err);
    }
})

//EDIT LISTING ROUTE
router.get('/:id/edit',isLoggedIn,async (req,res)=>{
        const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
})

router.put('/:id',async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect(`/listings/${id}`);
})

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
