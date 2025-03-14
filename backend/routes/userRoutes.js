const express = require('express');
const User = require('../models/UserModel');
const userRouter = express.Router();
const jwt = require('jsonwebtoken')



//? Register route
userRouter.post('/register',async(req,res)=>{
    try {
        const {username,email,password} = req.body;

        //! Check if user already exists

        const userExists = await User.findOne({
            email
        });
        if(userExists){
            return res.status(400).json({message:'User already exists!'});
        }
        //? Create New User
        const newUser = await User.create({
            username,
            email,
            password,
        });
        if(newUser){
            return res.status(201).json({
                _id:newUser._id,
                username: newUser.username,
                email:newUser.email,
            })
        }
    } catch (error) {
        res.status(400).json({message:error.message});
        
    }
});


//? Login Route
userRouter.post('/login',async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({
            email,
        });
        if(user && (await user.matchPassword(password))){
            res.json({
                _id:user._id,
                username:user.username,
                email:user.email,
                isAdmin:user.isAdmin,
                token:generateToken(user._id),
            })
        }else{
            res.status(401).json({message:'Invalid Login Details'});
        }
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});


//? Generate token using jwt
const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '30d',
    });
}

module.exports = userRouter;