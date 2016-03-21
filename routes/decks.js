var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var models = require('../modelsAndCollections');
var Bookshelf = require('bookshelf')(knex);

router.post('/createdeck', function(req, res, next) {
  var deck = {
    name: req.body.name,
    user_id: req.body.user_id,
  };
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

router.update('questions/:deckid', function(req, res, next) {
  if(req.decoded.id == req.body.hostid){
    var questionsInsert = []
    req.body.questions.forEach(function(question){
      var insert = {
        question_id: question.id,
        deck_id: req.body.id,
      }
      questionsInsert.push(insert);
    })
    knex('deck_questions').delete().where('deck_id', req.params.deckid).then(function(){
      knex('deck_questions').insert(questionsInsert, 'id').where('deck_id', req.params.deckid).then(function(id){
        console.log(id);
        res.status(204).json({eror: false, data:'success'});
      }).catch(function(error){
        res.status(500).json({error: true, data: error});
    }).catch(function(error){
      res.status(500).json({error: true, data: error});
    });
  });
  }else{
    res.status(403).json({error: true, data: 'incorrect user_id'});
  }
});

module.exports = router;
