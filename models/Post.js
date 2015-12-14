var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {type: String, required: true, trim: true},
  explanation: {type: String, required: true, trim: true},
  password: {type: String},
  numComment: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now},
},
{
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Post = mongoose.model('Post', schema);

module.exports = Post;
