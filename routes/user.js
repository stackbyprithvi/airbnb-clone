const express=require('express');
const router=require('express').Router({ mergeParams: true });
const User=require('../models/user');
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware/isLoggedIn');


router.get('/signup',(req,res)=>{ 
    res.render('usersAuth/signup');
});

router.post('/signup',async (req,res)=>{
    console.log(req.body);
    try{
        const {username,email,password}=req.body;
        const  newUser=new User({username,email})
        const registeredUser= await User.register(newUser,password)
        console.log(registeredUser);
        // AUTO LOGIN USER AFTER SIGNUP
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success','Welcome to Airbnb Clone');
            res.redirect('/listings');
        });
    }catch(e){
        req.flash('error',e.message);
        return res.redirect('/signup');
    }
});

router.get('/login',(req,res)=>{
    res.render('usersAuth/login');
});

//router.post('/login',saveRedirectUrl,passport.authenticate('local',{
router.post('/login',passport.authenticate('local',{
    failureRedirect:'/login',
    failureFlash:true,
}),(req,res)=>{
    req.flash('success','Welcome back!');
    res.redirect('/listings');
});

router.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
        if(err){return next(err);}
        req.flash('success','Logged you out!');
        res.redirect('/listings');
    });
});

module.exports=router;