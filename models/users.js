const { Schema, mongoose } = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');


const UserSchema= new Schema({
    name: {type:String,required:[true, "Firstname is required"]},
    email: {type:String, required:[true, "Lastname is required"], unique:true,lowercase:true, match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/},
    password:{type:String,select: false },
    role: { type: String, enum: ['user', 'admin', 'super-admin'], default: 'user' },
    subscriptionStatus: { type: String, enum: ['free', 'paid'], default: 'free' },
    socialId:{type:String,default:''},
    createdAt: { type: Date, default: Date.now },
},{timestamps:true})

UserSchema.plugin(uniqueValidator,{message:"This email is already exists."})

// schems methods
UserSchema.methods.comparePassword= async function(password,dbPassword){
   return await bcrypt.compare(password,dbPassword)
}

const User= mongoose.model('users',UserSchema)

module.exports=User