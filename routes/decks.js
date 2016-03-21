var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var models = require('../modelsAndCollections');
var Bookshelf = require('bookshelf')(knex);

router.post('/createdeck', function(req, res, next) {
  var deck = {
    name: req.body.name,
    user_id: req.body.user_id,
  }
  knex('decks').insert(deck, 'id').then(function(id){
    deck.id = id[0];
    res.status(200).json({error: false, data: deck});
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

router.delete('/:deckid', function(req, res, next) {
  knex('decks').delete().where('id', req.params.deckid).then(function(){
    res.status(204).json({eror: false, data:'success'});
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

module.exports = router;
