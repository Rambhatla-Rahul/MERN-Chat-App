const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//? User Schema

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        trim:true,

    },
    password:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false,

    }
    ,
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },

},{
    timestamps:true,
});

userSchema.pre('save',async function(next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.matchPassword = async function(enteredPassword){
 return await bcrypt.compare(enteredPassword,this.password)
};

const User = mongoose.model('User',userSchema);

module.exports = User;