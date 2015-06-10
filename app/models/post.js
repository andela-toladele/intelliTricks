
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PostSchema   = new Schema({
    title: String,
    description: String,
    text: String,
    postedBy: String,
    category: {id: String, name: String},
    tag: String,
    numOfLikes: {type: Number, default: 0},
    viewed: {type: Number, default: 0},
    postDate: {type: Date, default: Date.now()},
    comments:[{
      text: String,
      commentBy: String,
      commentDate: {type: Date, default: Date.now()},
      numOfLikes: {type: Number, default: 0}      
    }]
});

module.exports = mongoose.model('Post', PostSchema);