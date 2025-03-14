const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')


//? Protect the route

const protect = async(req,res,next)=>{
    //! Get the usertoken
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){    
        try{
            const token = await req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        }catch(error){
            res.status(401).json({message:'Not authorized, token failed'})
        }
        
    }
    else{
        res.status(401).json({message:'Not authorized, token not found'});
    }
    
}

const isAdmin = async (req,res,next) =>{
    try {
        if(req.user && req.user.isAdmin){            
            next();
        }
        else{   
            res.status(401).json({message:"Not authorized admin only!"});
        }
    } catch (error) {
        res.status(401).json({message:'Not Authorized'})
    }
}

module.exports = {protect,isAdmin}