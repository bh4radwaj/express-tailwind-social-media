const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {type:String,required:true},
    body: String,
    img:String,
    author_id:{type:String},
    likes:{type:Number,default:0},
    wholiked:[{type:String}]
    // author:{type:mongoose.Schema.Types.ObjectId,ref:'user'}
});

const userSchema = mongoose.Schema({
    email:{type:String,required:true},
    uid:{type:String,required:true},
    password:{type:String,required:true}
});

const profileSchema = mongoose.Schema({
    user_id:{type:String},
    followers:{type:Number,default:0},
    following:{type:Number,default:0},
    followerss:[{type:String}],
    followings:[{type:String}],
    profileimg:{type:String,default:'default.png'},
    albums:[{type:String}]
});


var post = mongoose.model('post',postSchema);
var user = mongoose.model('user',userSchema);
var profile = mongoose.model('profile',profileSchema);

post.prototype.author = async function(){
    return await user.findById(this.author_id).catch((err)=> console.log(err));
}


user.prototype.posts = async function(){
    return await post.find({author_id:this._id});
};

user.prototype.profile = async function(){
    return await profile.findOne({user_id:this._id});
};


var models = {post,user,profile};
module.exports = models;

