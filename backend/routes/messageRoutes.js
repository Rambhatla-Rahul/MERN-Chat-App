const { protect } = require("../middleware/authMiddleware");
const express = require('express');
const Chats = require("../models/ChatModel");


messageRouter = express.Router()


messageRouter.post('/',protect,async (req,res)=>{
    try {
        const {content,groupId} = req.body;
        
        
        const message = await Chats.create({
            sender: req.user._id,
            content,
            group: groupId,
        });
        const populatedMessage = await Chats.findById(message._id).populate('sender','username email');
        res.json({populatedMessage});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
});


messageRouter.get('/:groupId',protect,async(req,res)=>{
    try {
        
        
        const messages = await Chats.find({group : req.params.groupId}).populate('sender','username email').sort({createdAt:-1});
        // console.log(messages);
        res.json({messages});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
})
module.exports = messageRouter;