const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },
  categories:{
    type : Schema.Types.ObjectId,
    ref:'categories'
  },

  author:{
      type:Schema.Types.ObjectId,
      ref:'users'
  },

  post_image:{
    type:String,
    required:true
  }

});

module.exports = mongoose.model('Post', PostSchema);
