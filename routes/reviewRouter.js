const express=require('express');
const router=require('express').Router({ mergeParams: true });
const Listing=require('../models/listing');
const Review=require('../models/review');



router.post('/', async (req, res) => {
  const listing = await Listing.findById(req.params.id);    
    const review = new Review(req.body.review); 
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
});
module.exports=router;