const mongoose = require('mongoose');
var user = require('./user');
let postSchema = mongoose.Schema({
    title: {type:String,required:true},
    body: String,
    author:{type:String}
    // author:{type:mongoose.Schema.Types.ObjectId,ref:'user'}
});

postSchema.methods.titl = function(){
    let post = this.toObject();
    return post.title;
};


let post = mongoose.model('post',postSchema);

post.prototype.getAuthor = async function(){
    let usr = await user.findById(this.author).catch((err)=> console.log(err));
    return usr;
};

module.exports = post;
