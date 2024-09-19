const mongoose = require('mongoose');
// var p = require('./test');
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

const userSchema = mongoose.Schema({
    email:{type:String,required:true},
    uid:{type:String,required:true},
    password:{type:String,required:true},
    // posts:[{type:mongoose.Schema.Types.ObjectId,ref:'post'}]
});

post.prototype.getAuthor = async function(){
    let usr = await user.findById(this.author).catch((err)=> console.log(err));
    return usr;
};



let user = mongoose.model('user',userSchema);

user.prototype.getPosts = async function(){
    return await p.findOne().catch((err)=> console.log(err));
};

module.exports = user;
