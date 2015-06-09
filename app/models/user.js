
var mongoose     = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    username: {type: String, index: {unique: true}},
    password: String,
    email: {type: String, default: ''},
    img: {type: String, default: ''},
    noOfLikes: {type: Number, default: 0},
    regDate: {type: Date, default: Date.now()},
    gender: {type: String, default: ''},
    userType: String,
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);