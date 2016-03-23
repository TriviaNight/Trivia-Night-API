var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var models = require('../modelsAndCollections');
var Bookshelf = require('bookshelf')(knex);

//get host by ID
router.get('/', function(req, res, next) {
  console.log('getting host');
  console.log(req.decoded);
  models.Host.forge({id: req.decoded.id}).fetch({withRelated: ['decks', 'decks.questions','decks.questions.catagory','questions', 'questions.catagory', 'questions.userResponses', 'games', 'games.decks']}).then(function(host){
    if(!host){
      res.status(404).json({error: true, data:'user not found'});
    }else{
      res.status(200).json({error: false, data: host});
    }
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

module.exports = router;
