var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var models = require('../modelsAndCollections');
var Bookshelf = require('bookshelf')(knex);

//Get questions
router.get('/', function(req, res, next){
  models.Questions.forge().fetch({withRelated: ['catagory', 'flags']}).then(function(questions){
    res.status(200).json({error: false, data: questions});
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

router.get('/flags', function(req, res, next){
  knex('flags').select().then(function(flags){
    res.status(200).json({error: false, data: flags});
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

router.post('/flags/:questionId', function(req, res, next){
  var tempuser = 2;
  var flag = {
    question_id: req.params.questionId,
    user_id: tempuser,
  };
  knex('flags').insert(flag, 'id').then(function(id){
    flag.id = id[0];
    res.status(200).json({error: false, data: flag});
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

router.delete('/flags/:questionId', function(req, res, next){
  var tempuser = 2;
  var flag = {
    question_id: req.params.questionId,
    user_id: tempuser,
  };
  knex('flags').where(flag).delete().then(function(){
    res.status(204).json({eror: false, data:'success'});
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});


module.exports = router;
