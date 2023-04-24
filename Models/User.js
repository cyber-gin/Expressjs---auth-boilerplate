const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
    },
    name:{
        type:String,
        required:true
    },
    summary:{
        type:String
    },
    subscription:{
        type:Number,
        default:0,
    },
    verification:{
        type:String,
    },
    verified:{
        type:Boolean,
        default:false
    },
    token:{
        type:String
    },
    googleId:{
        type:String
    },
})
UserSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) return next(err);
            user.password = hash;
            next();
        })
    })
})
UserSchema.methods.isValidPassword = function(candidatePassword){
   return new Promise((resolve, reject) => {
         bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
              if(err) return reject(err);
              if(!isMatch) return reject(false);
              resolve(true);
         })
    })
}
const User = mongoose.model('user', UserSchema);
module.exports = User;