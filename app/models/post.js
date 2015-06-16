
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PostSchema   = new Schema({
    title: String,
    description: String,
    text: String,
    postedBy: String,
    category: {id: String, name: String},
    tag: String,
    likes: [{
      username: String,
      when: {type: Date, default: Date.now()}           
    }],
    viewed: {type: Number, default: 0},
    when: {type: Date, default: Date.now()},
    comments:[{
      text: String,
      commentBy: String,
      when: {type: Date, default: Date.now()},     
      likes: [{
      username: String,
      when: {type: Date, default: Date.now()}           
      }]      
    }]
});

module.exports = mongoose.model('Post', PostSchema);