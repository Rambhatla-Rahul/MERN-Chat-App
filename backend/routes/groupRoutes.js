const express = require('express');
const Group = require('../models/GroupModel');
const {protect,isAdmin} = require('../middleware/authMiddleware');


const groupRouter = express.Router()



//? Create new Group

groupRouter.post('/',protect,isAdmin,async(req,res) =>{
    try {
        const name = req.body.newGroupName;
        const description = req.body.newGroupDescription;
        const group = await Group.create({
            name,
            description,
            admin:req.user._id,
            members: [req.user._id],

        });
        const populatedGroup = await Group.findOne(group._id).populate('admin',"usernam email").populate('members',"username email");
        res.status(201).json({
            populatedGroup
        })
    } catch (error) {
        res.status(400).json({message:error.message});
    }
})

//? Fetch all groups

groupRouter.get('/',protect,async (req,res)=>{
    try {
        const groups = await Group.find().populate("admin","username email").populate("members","username email");
        res.json({
            groups,
        })
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

//? Joining Group
groupRouter.post('/:groupId/join',async(req,res)=>{
    try {
        const group = await Group.findById(req.params.groupId);
        if(!group){
            
            return res.status(404).json({message:'Group not found!'});
        }
        if(group.members.includes(req.body.user._id)){    
            return res.status(400).json({message:"Already a member of this group!"});
        }
        group.members.push(req.body.user._id);
        await group.save();
        res.json({message: "Successfully joined the group"});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

//? Leaving the group

    groupRouter.post('/:groupId/leave',async(req,res)=>{
    try {
        const group = await Group.findById(req.params.groupId)
        if(!group){
            return res.status(404).json({message:'Group not found!'});
        }
        if(group.members.includes(req.body.user._id)){
            group.members.pop(req.body.user._id);
            await group.save();
            return res.json({message: "Successfully left the group"});
        }
        
        return res.status(400).json({message:"You are not part of this group!"});
        
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
})
module.exports = groupRouter;