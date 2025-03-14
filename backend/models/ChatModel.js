const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//? User Schema

const messageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'

    },
    content:{
        type:String,
        required:true,
    },
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
    },
},{
    timestamps:true,
});

const Chats = mongoose.model('Chats',messageSchema);

module.exports = Chats;