import path from 'path';
const express=require('express');
const router=express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var User = require('../data/user_model');
//const sqlite3 = require('sqlite3').verbose();
/*const DB_PATH = './data/ranban.db';
const DB = new sqlite3.Database(DB_PATH, function(err){
    if (err) {
        console.log(err)
        return
    }
    console.log('Connected to ' + DB_PATH + ' database.')
    
    //DB.close()
});*/

// body-parser to parse incoming parameters requests to req.body
router.use(bodyParser.urlencoded({ extended: true }));
// cookie-parser - to access the cookies stored in the browser. 
router.use(cookieParser());
// express-session - to track the logged-in user across sessions.
router.use(session({
    key: 'user_sid',
    secret: 'GmonthendauthrandomkeyG',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
router.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/home');
    } else {
        next();
    }    
};


// route for Home-Page
router.get('/', sessionChecker, (req, res) => {
    res.redirect('/auth/login');
});


// route for user signup
router.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(path.join(__dirname,'../public/html/signup.html'));
    })
    .post((req, res) => {
        console.log("signup post called")
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            console.log("signup.then called")
            req.session.user = user.dataValues;
            res.redirect('/home');
        })
        .catch(error => {
            console.log("signup.catch called")
            res.redirect('/auth/signup');
        });
    });


// route for user Login
router.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(path.join(__dirname,'../public/html/login.html'));
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.redirect('/auth/login');
            } else if (!user.validPassword(password)) {
                res.redirect('/auth/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/home');
            }
        });
    });


// route for user's home
router.get('/home', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(path.join(__dirname,'../public/html/home.html'));
    } else {
        res.redirect('/auth/login');
    }
});


// route for user logout
router.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        console.log("user logout")
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/auth/login');
    }
});


// route for handling 404 requests(unavailable routes)
router.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


module.exports=router;