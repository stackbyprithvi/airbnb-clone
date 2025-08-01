const express=require('express')
const app =express();
const mongoose=require('mongoose');

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

const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});