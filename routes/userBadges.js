var express = require('express');
var router = express.Router();
var knex = require('../db/knex');


// GET users badges
router.get('/:id', function(req, res, next) {
  knex('user_badges').select().then(function(badges){
    res.status(200).json({error: false, data: badges});
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

// Add a user badges
router.post('/:id', function(req, res, next) {
  var userBadge = {
    user_id: req.params.id,
    badge_id: req.body.badgeID,
  };
  knex('user_badges').insert(userBadge).then(function(badge){
    console.log(badge);
    res.status(200).json({error: false, data: userBadge});
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

module.exports = router;
