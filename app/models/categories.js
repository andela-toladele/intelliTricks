
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CategorySchema   = new Schema({
    name: {type: String, index: {unique: true}},
    createdBy: String,
    topLikedUsers: [{
      user: String,
      noOfLikes: {type: Number, default: 0}
    }]
});

module.exports = mongoose.model('Category', CategorySchema);