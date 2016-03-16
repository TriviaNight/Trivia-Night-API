var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var models = require('../modelsAndCollections');
var Bookshelf = require('bookshelf')(knex);

// GET players by ID
router.get('/:id', function(req, res, next){
  models.Player.forge({id: req.params.id}).fetch({withRelated: ['badges', 'games', 'games.players', 'games.rounds', 'games.rounds.userResponses']}).then(function(player){
    if(!player){
      res.status(404).json({error: true, data:'user not found'});
    }else{
      res.status(200).json({error: false, data: player});
    }
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

module.exports = router;
