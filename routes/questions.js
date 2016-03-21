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

router.post('/', function(req, res, next){
  console.log('in route');
  var question = {
    question: req.body.question,
    response_a: req.body.choice_a,
    response_b: req.body.choice_b,
    response_c: req.body.choice_c,
    response_d: req.body.choice_d,
    response_e: req.body.choice_e,
    correct_answer: req.body.correct_answer,
    catagory_id: req.body.catagory.id,
    user_id: req.body.user_id,
  };
  knex('questions').insert(question, 'id').then(function(id){
    question.catagory = req.body.catagory;
    question.id = id[0];
    res.status(200).json({error: false, data: question});
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
