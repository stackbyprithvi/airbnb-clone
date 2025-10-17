const express=require('express');

function isLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','You must be signed in first!');
        return res.redirect('/login');
    } 
    next();
}

module.exports=isLoggedIn;


/*module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }   
    next();
}*/