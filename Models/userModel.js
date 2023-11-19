const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id:{
        type: String,
        require: true,
    },
    firstname:{
        type: String,
        require:false
    },
    lastname:{
        type: String,
        require: false
    },
    email:{
        type : String,
        require: true
    },
    password:{
        type: String,
        require : true
    },
    resetToken: {
        type: String,
        default: null,
      },
},{timestamps: true});

module.exports = mongoose.model('UserModel', userSchema,'Users');