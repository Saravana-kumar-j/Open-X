const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    userName: String,
    address: String,
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
