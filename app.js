require('dotenv').config();
console.log(process.env.CLOUD_NAME);

const express=require('express')
const app =express();
const path=require('path');
const ejsMate=require('ejs-mate');
const methodOverride = require('method-override');
const session=require('express-session');
const flash=require('connect-flash');
const localStrategy=require('passport-local');
const passport=require('passport');
const User=require('./models/user');
const userRouter=require('./routes/user');
const listingRouter = require('./routes/listingRouter');
const reviewRouter = require('./routes/reviewRouter');
const mongoose =require('mongoose');

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err.message);
  }
}
main();





app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs',ejsMate);


app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
});


app.use('/listings',listingRouter);

app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);




const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});