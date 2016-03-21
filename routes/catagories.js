var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var models = require('../modelsAndCollections');
var Bookshelf = require('bookshelf')(knex);

router.get('/', function(req, res, next) {
  knex('catagories').select().then(function(catagories){
    res.status(200).json({error: false, data: catagories});
  }).catch(function(error){
    res.status(500).json({error: true, data: error});
  });
});

module.exports = router;
