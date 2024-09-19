var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb+srv://bh4radwaj:lRJoR1LCaegtv4Cd@cluster0.rhba5.mongodb.net/ejs', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('connected to mongodb');
});

router.get('/', async function (req, res, next) {
    // console.log(await bcrypt.genSalt(10));
    if (req.cookies.flash) {
        flash = true;
        res.clearCookie('flash');
    }
    else flash = false;
    res.render('index', {title: 'StyleX', grret: 'hi', logged_in: req.session._id, success: req.flash('success'), error: req.flash('error'), flash: flash});
});

router.get('/contact', function (req, res, next) {
    res.render('contact', {title: 'contact', logged_in: req.session._id, success: req.flash('success'), error: req.flash('error')});
});

router.get('/about', function (req, res, next) {
    res.render('about', {title: 'about', logged_in: req.session._id, success: req.flash('success'), error: req.flash('error')});
});

router.get('/services', function (req, res, next) {
    res.render('services', {title: 'services', logged_in: req.session._id, success: req.flash('success'), error: req.flash('error')});
});

router.get('/register', on_out, function (req, res, next) {
    res.render('register', {title: 'register', logged_in: req.session._id, success: req.flash('success'), error: req.flash('error')});
});

router.get('/login', on_out, function (req, res, next) {
    res.render('login', {title: 'login', logged_in: req.session._id, success: req.flash('success'), error: req.flash('error')});
});

function on_out(req, res, next) {
    if (req.session._id) {
        req.flash('error', 'you already logged in!!');
        res.redirect('/profile');
    }
    next();
}

module.exports = router;
