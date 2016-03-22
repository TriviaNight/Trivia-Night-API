var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var knex = require('../db/knex');
var jwt = require('jsonwebtoken');
var request = require('request');

require('dotenv').load();

passport.use(new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    var userProfile = {
      email: profile.emails[0].value,
      rating: 1000,
    };
    if(profile.photos[0].value){
      userProfile.image_url = profile.photos[0].value;
    }

    knex('users').where('email', userProfile.email).select().first().then(function(user) {
      if (!user) {
        console.log("no user");
        knex('users').insert(userProfile, 'id').then(function(id) {
            userProfile.id = id[0];
            done(null, userProfile);
          }).catch(function(error){
            done(error, null);
          });
        } else {
          done(null, user);
        }
      }).catch(function(error){
        done(error, null);
      });
  }
));

router.get('/google/callback', function(req, res, next) {
  passport.authenticate('google', function(err, user, info) {
    if (err) {
      next(err);
    } else if (user) {

      // create token
      var token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn:15778463,
      });

      //set return URL
      var authUrl = process.env.OAUTH_REDIRECT_URL +token;
      res.redirect(authUrl);

    } else if (info) {
      next(info);
    }
  })(req, res, next);
});




router.get('/google', passport.authenticate('google', {
    scope: 'email'
  }),
  function(req, res) {
    res.json({error: false, data:'success'});
});

router.post('/google/mobile', function(req, res, next) {
    request('https://www.googleapis.com/plus/v1/people/me?access_token='+req.body.access_token, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var profile = JSON.parse(body) // Show the HTML for the Google homepage.
        var userProfile = {
          email: profile.emails[0].value,
          rating: 1000,
        };
        if(profile.image.url){
          userProfile.image_url = profile.image.url;
        }
        console.log('bout to enter database', userProfile)
        knex('users').where('email', userProfile.email).select().first().then(function(user) {
          if (!user) {
            console.log("no user");
            knex('users').insert(userProfile, 'id').then(function(id) {
                userProfile.id = id[0];
                var token = jwt.sign(userProfile, process.env.JWT_SECRET, {
                  expiresIn:15778463,
                });
                userProfile.token = token;
                res.json({error: false, data: userProfile});

              }).catch(function(error){
                  res.json({error: true, data: error});
              });
            } else {
              var token = jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn:15778463,
              });
              user.token = token;
              res.json({error: false, data: user}) ;
            }
          }).catch(function(error){
            res.json({error: true, data: error});
          });
      }else{
        res.json({error: true, data: "could not connect to google"});
      }
    })


});


router.get('/logout', function(req, res, next){
  req.logout();
  res.json({error: false, data: 'logged out'});
});


module.exports = router;
