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
    cardlimit:{type:Number,default:25},
    payent_intent:{type:String,default:''},
    isAdmin:{type:Number,default:0},
    isSuperAdmin:{type:Number,default:0},
    createdAt: { type: Date, default: Date.now },
},{timestamps:true})

UserSchema.plugin(uniqueValidator,{message:"This email is already exists."})

// schems methods
UserSchema.methods.comparePassword= async function(password,dbPassword){
   return await bcrypt.compare(password,dbPassword)
}
// Method to update the order of flashcards
UserSchema.methods.updateLimit = function(userId,limit) {
  // newOrder should be an array of { flashcardId, order }
  const udjd = this._id.find(f => f._id.toString() === userId);
 if (udjd) {
   udjd.cardlimit = limit;
 }
};

const User= mongoose.model('users',UserSchema)

module.exports=User