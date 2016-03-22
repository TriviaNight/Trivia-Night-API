var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var models = require('../modelsAndCollections');
var Bookshelf = require('bookshelf')(knex);



// GET user by ID
router.get('/:id', function(req, res, next) {
  knex('users').select().where('id', req.params.id).then(function(user){
    if(!user){
      res.status(404).json({error: true, data:'user not found'});
    }else{
      res.status(200).json({error: false, data: user[0]});
    }
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

// GET all users
router.get('/', function(req, res, next) {
  knex('users').select().then(function(users){
    res.status(200).json({error: false, data: users});
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

router.patch('/username', function(req, res, next){
  console.log('in this route');
  console.log(req.decoded)
  knex('users').where('id', req.decoded.id).update({username: req.body.username}).then(function(update){
    res.status(200).json({error: false, data: users});
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});



module.exports = router;
