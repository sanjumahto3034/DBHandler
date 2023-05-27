const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userData = new Schema({
    name:{type:String},
    email:{type:String},
    phoneNo:{type:String},
    pass:{type:String},
},{timestamps:true});

const User = mongoose.model('userSchema',userData);
module.exports = User;