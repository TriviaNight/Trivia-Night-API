var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var knex = require('../db/knex');
var jwt = require('jsonwebtoken');

require('dotenv').load();


passport.use(new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile);
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
            userProfile.id = id;
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
        })
        var authUrl = process.env.OAUTH_REDIRECT_URL +token;
        res.redirect(authUrl);

      } else if (info) {
        next(info);
      }
    })(req, res, next);
  });

router.get('/google', passport.authenticate('google', {
    // scope: 'profile'
    scope: 'email'
  }),
  function(req, res) {
    res.json('success')
});


  router.get('/logout', function(req, res, next){
    req.logout();
    res.json({error: false, data: 'logged out'})
  })








module.exports = router