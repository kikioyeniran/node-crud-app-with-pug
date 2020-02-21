const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const domain = 'sandboxfdf76a99b5044d6c96c28e0971d8e9ca.mailgun.org';
const api_key = '3896a986c536ba4c44b6278b43417c4a-2ae2c6f3-9188bee6';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

//Bring in User Models
let User =  require('../models/user');

//Register form
router.get('/register', (req, res)=>{
    res.render('register');
});

//Router for mailgun test
router.get('/mailgun',(req,res)=>{
    console.log('here');
    var data = {
        from: 'Winnie <noreply@kvetsluzeb.org>',
        to: 'kikioyeniran@gmail.com',
        subject: 'Password Reset',
        text: 'I am testing'
      };

      mailgun.messages().send(data, function (error, body) {
          if(error){
              console.log(error)
          }
        console.log(body);
      });
})

//Register Processes
router.post('/register', (req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        res.render('register', {
            errors:errors
        });
    }else{
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err){
                console.log(err);
            }
            newUser.password = hash;
            newUser.save((err)=>{
                if(err){
                    console.log(err);
                    return;
                }else{
                    req.flash('success', 'You are now registered and can login');
                    res.redirect('/users/login');
                }
            })
        });
    });
    }
});

//Login  Form Page route
router.get('/login', (req, res)=>{
    res.render('login');
});

//Login Process
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        //author: user.name,
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login')
});
module.exports = router;