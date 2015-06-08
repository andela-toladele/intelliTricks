
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PostSchema   = new Schema({
    title: String,
    description: String,
    text: String,
    postedBy: String,
    category: String,
    tag: String,
    numOfLikes: {type: Number, default: 0},
    //editMode: {type: boolean, default: true},
    postDate: {type: Date, default: Date.now()},
    comments:[{
      text: String,
      commentBy: String,
      commentDate: {type: Date, default: Date.now()},
      numOfLikes: {type: Number, default: 0}//,
      //editMode: {type: boolean, default: true}
    }]
});

module.exports = mongoose.model('Post', PostSchema);