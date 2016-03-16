var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var models = require('../modelsAndCollections');
var Bookshelf = require('bookshelf')(knex);

//get host by ID
router.get('/:id', function(req, res, next) {
  models.Game.forge({id: req.params.id}).fetch({withRelated: ['rounds', 'players', 'rounds.userResponses', 'host']}).then(function(game){
    if(!game){
      res.status(404).json({error: true, data:'game not found'});
    }else{
      res.status(200).json({error: false, data: game});
    }
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

module.exports = router;
