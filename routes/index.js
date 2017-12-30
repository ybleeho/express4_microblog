var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');



exports.index = function (req, res) {
    res.render('index',{title : 'Homepage'});
};
exports.user = function (req, res) {

};
exports.post = function (req, res) {

}
exports.reg = function (req, res) {
    res.render('reg',{
        title:'register'
    });
}
exports.doReg = function (req, res) {
    //test the password match
    console.log(req.body);
    if(req.body['password-repeat']!=req.body['password']){
        console.log('not match');

        req.flash('error','not match!');
        return res.redirect('/reg');
    }

    // hash password
   /*
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    */
    var newUser = new User({
        name : req.body.username,
        password : req.body.password
    });
    console.log(newUser);
    //test the user exit
    User.get(newUser.name,function (err, user) {
        if(user)
            err = 'Username already exists';
        if(err){
            console.log(err);
            req.flash('error',err);
            return res.redirect('/reg')
        }
        //if not exist add the user
        newUser.save(function (err) {
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            console.log(newUser);
            req.flash('success','regist successful!');
            //console.log('sucess?')
            res.redirect('/');
        });
    });

}
exports.longin = function (req, res) {
    res.render('login',{
        title : 'login',
    })
}
exports.doLogin = function (req, res) {
    User.get(req.body.username,function (err, user) {
        if(!user){
            req.flash('error','user do not exit');
            return res.direct('/login');
        }
        if(user.password!=password){
            req.flash('error','password error');
            return res.redirect('/login');
        }
        req.session.user = user;
        req.flash('success','login succeed');
        res.redirect('/');
    })
}
exports.logout = function (req, res) {
    req.session.user = null;
    req.flash('success','logout success');
    res.redirect('/');
}

