const express=require('express')
const app =express();
const path=require('path');
const ejsMate=require('ejs-mate');
const methodOverride = require('method-override');
const connectDB=require('./connection');
const session=require('express-session');
const flash=require('connect-flash');
const localStrategy=require('passport-local');
const passport=require('passport');
const User=require('./models/user');
const userRouter=require('./routes/user');
const listingRouter = require('./routes/listingRouter');
const reviewRouter = require('./routes/reviewRouter');


connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs',ejsMate);


app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));


app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',(req,res)=>{
    res.send("WELCOME TO AIRBNB CLONE");
})

app.use('/listings',listingRouter);

app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);




const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});