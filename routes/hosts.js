var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var models = require('../modelsAndCollections');
var Bookshelf = require('bookshelf')(knex);

//get host by ID
router.get('/:id', function(req, res, next) {
  models.Host.forge({id: req.params.id}).fetch({withRelated: ['decks', 'questions', 'questions.catagory']}).then(function(host){
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
