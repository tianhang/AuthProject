var express = require('express');
var router = express.Router();
var User   = require('../app/models/user'); // get our mongoose model
var config = require('../config'); // get our config file
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// create a sample user
var user = new User({
    name: 'Nick Cerminara',
    password: 'password',
    admin: true,
    date:new Date()
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.get('/auth', function (req, res) {
    // if user is found and password is right
    // create a token
    var token = jwt.sign(user, config.secret, {
        expiresIn: 140 // expires in 24 hours
    });
    // return the information including token as JSON
    res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token

    });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function (req, res) {

    // find the user
    User.findOne({
        name: req.body.name
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.json({success: false, message: 'Authentication failed. User not found.'});
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({success: false, message: 'Authentication failed. Wrong password.'});
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});


module.exports = router;
