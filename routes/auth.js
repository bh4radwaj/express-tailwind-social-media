var express = require('express');
var router = express.Router();
var models = require('../models');
var user = models.user;
var post = models.post;
var profile = models.profile;
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

const app = require('../app.js');

router.post('/register', async (req, res, next) => {
    // req.session.grret = 'hi';
    console.log(req.body);
    if (req.body.password !== req.body.confirm) res.redirect('/register');
    let usr = new user({
        email: req.body.email,
        uid: req.body.uid,
        password: req.body.password
    });
    let salt = await bcrypt.genSalt(10).catch((err) => console.error(err));
    let hash = await bcrypt.hash(usr.password, salt).catch((err) => console.error(err));
    usr.password = hash;
    await usr.save();
    prof = new profile({user_id: usr._id});
    prof.save();

    req.flash('success', 'account created.you can login!');
    res.redirect('/login');
});

// async function check(pass,hash){
//     data = await bcrypt.compare(pass,hash);
//     console.log(`data:${data}`);
//     return data;
// }

router.post('/login', async (req, res, next) => {
    // app.locals.logged_in = true;
    let {uid, password} = req.body;
    usr = await user.find({uid});
    console.log(usr[0]);
    usr = usr[0];
    if (!usr) {req.flash('error', 'invalid data'); res.redirect('/login');}
    let done = await bcrypt.compare(password, usr.password).catch((err) => console.log(err));
    // let done = await check(password,usr.password);
    console.log(done);
    if (!done) {req.flash('error', 'wrong password! try again'); res.redirect('/login');}
    req.session._id = usr._id;
    console.log('logged in')
    req.flash('success', 'you have been logged in!!');
    res.redirect('/profile');
});

router.get('/profile', on_in, async (req, res, next) => {
    usr = await user.findById(req.session._id);
    posts = await usr.posts();
    posts.reverse();
    total_posts = posts.length;
    prof = await usr.profile();
    res.render('profile', {title: 'Profile', user: usr, profile: prof, total_posts: total_posts, posts: posts, logged_in: req.session._id, success: req.flash('success'), error: req.flash('error')});
});

router.post('/edit-profile', async (req, res, next) => {
    usr = await user.findById(req.session._id);
    let {uid, password} = req.body;
    usr.uid = uid;
    if (password) {
        let salt = await bcrypt.genSalt(10).catch((err) => console.error(err));
        let hash = await bcrypt.hash(password, salt).catch((err) => console.error(err));
        usr.password = hash;
    }
    prof = await usr.profile();
    if (req.files) {
        file = req.files.img;
        ext = req.files.img.mimetype;
        ext = ext.split('/')[1];
        fn = await bcrypt.genSalt(10);
        var img = `${fn}.${ext}`;
        img = img.replace('/', '');
        console.log(img);
        prof.profileimg = img;
        prof.rel
        await file.mv(`./public/other_imgs/${img}`);
        prof.save();
    }
    usr.save();
    req.flash('success', 'profile updated!');
    res.redirect('/profile');
})

router.post('/addpost', on_in, async (req, res, next) => {
    let {title, body} = req.body;
    if (req.files) {
        file = req.files.img;
        ext = req.files.img.mimetype;
        ext = ext.split('/')[1];
        fn = await bcrypt.genSalt(10);
        var img = `${fn}.${ext}`;
        img = img.replace('/', '');
        console.log(img);
        await file.mv(`./public/posts/${img}`);
    }
    usr = await user.findById(req.session._id);
    author_id = usr.id;
    pst = new post({title, body, img, author_id});
    pst.save();
    req.flash('success', 'new post created!');
    res.redirect('/profile');
});

router.get('/search', on_in, (req, res, next) => {
    res.render('search', {title: 'search', success: req.flash('success'), error: req.flash('error'), logged_in: req.session._id});
});

router.get('/profiles/:user', on_in, async (req, res, next) => {
    uid = req.params.user;
    usr_ = await user.findOne({uid: uid});
    prof = await usr_.profile();
    console.log(prof);
    posts = await usr_.posts();
    posts.reverse();
    total_posts = posts.length;
    follow_ok = true;
    prof.followerss.forEach((fllo) => {
        if (fllo == req.session._id) follow_ok = false;
    })
    res.render('users_prof', {usr: {usr_, prof, posts, total_posts, follow_ok}, error: req.flash('error'), success: req.flash('success'), logged_in: req.session._id, title: 'profiles', prof: prof, same_user: usr_._id == req.session._id ? true : false});
})

router.post('/follow/:id', async (req, res, next) => {
    console.log('follow hit');
    id = req.params.id;
    f_user = await user.findById(id);
    curr_user = await user.findById(req.session._id);
    f_prof = await f_user.profile();
    c_prof = await curr_user.profile();
    console.log(f_prof.followerss);
    console.log(c_prof.followings);
    f_prof.followerss.push(req.session._id);
    f_prof.followers += 1;
    c_prof.followings.push(id);
    c_prof.following += 1;
    f_prof.save();
    c_prof.save();
    res.send('ok');
})



router.post('/unfollow/:id', async (req, res, next) => {
    console.log('follow hit');
    id = req.params.id;
    f_user = await user.findById(id);
    curr_user = await user.findById(req.session._id);
    f_prof = await f_user.profile();
    c_prof = await curr_user.profile();
    console.log(f_prof.followerss);
    console.log(c_prof.followings);
    f_prof.followerss.pop(req.session._id);
    f_prof.followers -= 1;
    c_prof.followings.pop(id);
    c_prof.following -= 1;
    f_prof.save();
    c_prof.save();
    res.send('ok');
})

router.get('/post-delete/:id', async (req, res, next) => {
    pst = await post.findById(req.params.id);
    usr = await pst.author();
    console.log(usr._id);
    console.log(req.session._id);
    if (usr._id != req.session._id) res.send('noo');
    pst.delete();
    req.flash('success', 'post been deleted!');
    res.redirect('/profile');
})

router.post("/post-edit-get/:id", async (req, res, next) => {
    pst = await post.findById(req.params.id);
    res.json(pst);
})

router.post("/post-edit/:id", async (req, res, next) => {
    pst = await post.findById(req.params.id);
    usr = await post.author();
    if (usr._id != req.session._id) res.send('noo');
    pst.title = req.body.title;
    pst.body = req.body.body;
    pst.save();
    res.send('ok');
})

router.post('/get-post-data/:id', async (req, res, next) => {
    setTimeout(async () => {
        post_ = await post.findById(req.params.id);
        author = await post_.author();
        profile = await author.profile();
        resp = {};
        resp.prof_img = profile.profileimg;
        resp.uid = author.uid;
        resp.likeok = true;
        post_.wholiked.forEach((id) => {
            if (id == req.session._id) resp.likeok = false;
        });
        resp.title = post_.title;
        resp.likes = post_.likes;
        resp.id = post_._id;
        resp.body = post_.body;

        res.json(resp);
    }, 2000);
});

router.post('/like/:id', async (req, res, next) => {
    id = req.params.id;
    post_ = await post.findById(id);
    users = post_.wholiked;
    hit = false;
    users.forEach((id_) => {
        if (req.session._id == id_) hit = true
    });
    if (hit) res.send(null);
    post_.wholiked.push(req.session._id);
    post_.likes += 1;
    post_.save();
    res.json({'success': true});
});

router.post('/dislike/:id', async (req, res, next) => {
    post_ = await post.findById(req.params.id);
    users = post_.wholiked;
    hit = false;
    users.forEach((id_) => {
        if (id_ == req.session._id) hit = true
    });
    if (!hit) res.send(null);
    post_.wholiked.pop(req.session._id);
    post_.likes -= 1;
    post_.save();
    res.json({'success': true});

});

router.post('/get-prof', async (req, res, next) => {
    usr = await user.findById(req.session._id);
    prof = await usr.profile();
    resp = {
        uid: usr.uid,
        email: usr.email,
        img: prof.profileimg
    }
    res.json(resp)
})

router.post('/search/:text', async (req, res, next) => {
    // console.log('new fetch');
    setTimeout(async () => {
        let text = req.params.text;
        text = new RegExp(text);
        data = await user.find({uid: text});

        resp = [];
        for (var i = 0; i < data.length; i++) {
            d = {};
            d.uid = data[i].uid;
            d.email = data[i].email;
            prof = await data[i].profile();
            d.prof_img = prof.profileimg;
            resp.push(d);
        }
        console.log(resp);
        res.json(resp);
    }, 2000);
});


router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.cookie('flash', 'yes');
    res.redirect('/');
});

function on_in(req, res, next) {
    console.log('middleware');
    if (!req.session._id) res.redirect('/login');
    next()
};

module.exports = router;
