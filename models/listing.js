const mongoose =require('mongoose');
const  listingSchema= new mongoose.Schema({
    title:{
      type:  String,
      required:true,
    } ,
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set : (v) => v === " " ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60": v,
        //v gets value of image for the form -condition is if v is empty string then our --DEFAULT-- image else v

    },
    price:Number,
    location:String,
    country:String
});
const Listing = mongoose.model('Listing', listingSchema);
module.exports=Listing;
