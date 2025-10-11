const mongoose =require('mongoose');

async  function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb-Clone')
}

main()
.then(() =>{
    console.log("Connected to MongoDB")
})
.catch((err) => console.log(err));  

module.exports=main;