const express=require('express')
const app =express();
const mongoose=require('mongoose');
const Listing=require('./models/listing');

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
// app.get('/testListing',async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "Cozy Beachfront Cottage",
//     description:
//       "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
//     image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//     price: 1500,
//     location: "Malibu",
//     country: "United States",
//   });

  await sampleListing.save();
  res.send("Sample listing created");
});

const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});