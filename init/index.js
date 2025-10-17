const mongoose=require('mongoose');
const initData=require('./data.js')
const Listing=require('../models/listing.js')

main()
.then(() =>{
    console.log("Connected to MongoDB")
})
.catch((err) => console.log(err));  
    

async  function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb-Clone')
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68eaab7259f4e0bd74af7fed"}))
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
}
initDB();