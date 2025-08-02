const express=require('express')
const app =express();
const mongoose=require('mongoose');
const Listing=require('./models/listing');
const path=require('path');
const  ejsMate=require('ejs-mate');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
 
app.engine('ejs',ejsMate);
main()
.then(() =>{
    console.log("Connected to MongoDB")
})
.catch((err) => console.log(err));  
async  function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb-Clone')
}
app.get('/',(req,res)=>{
    res.send("WELCOME TO AIRBNB CLONE");
})

//SHOW LISTINGS ROUTE
app.get('/listings',async (req,res)=>{
  const allListings=  await Listing.find({});
  res.render('listings/index.ejs',{allListings});
    })

    //CREATE LISTING ROUTE
app.get('/listings/new',(req,res)=>{
    res.render('listings/new.ejs');
})

    //SHOW ROUTE
app.get('/listings/:id',async (req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('listings/show.ejs',{listing});
})

app.post('/listings',async (req,res)=>{
const newListing= new Listing(req.body.listing);
await newListing.save();
res.redirect('/listings');
})

//EDIT LISTING ROUTE
app.get('/listings/:id/edit',async (req,res)=>{
        const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
})

app.put('/listings/:id',async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect(`/listings/${id}`);
})

//DELETE LISTING ROUTE
app.delete('/listings/:id',async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
})

const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});