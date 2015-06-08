
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    username: {type: String, index: {unique: true}},
    password: String,
    email: {type: String, default: ''},
    img: {type: String, default: ''},
    noOfLikes: {type: Number, default: 0},
    regDate: {type: Date, default: Date.now()},
    gender: {type: String, default: ''},
    userType: String
});

module.exports = mongoose.model('User', UserSchema);