var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TagSchema   = new Schema({
    name: {type: String, index: {unique: true}},
    createdBy: String
});

module.exports = mongoose.model('Tag', TagSchema);