const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        unique : true,
        require : true,
    },
    password : {
        type: String,
        required: true,
    },
    createdon : {
        type: Date,
        default: Date.now 
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;