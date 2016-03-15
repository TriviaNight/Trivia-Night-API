var knex = require('./db/knex');
var Bookshelf = require('bookshelf')(knex);

var model = {};

//model for join table
model.UserBadge = Bookshelf.Model.extend({
    tableName: 'user_badges',
});

//model for getting a player
model.Player = Bookshelf.Model.extend({
    tableName: 'users',
    badges: function (){
      return this.belongsToMany(model.Badge).through(model.UserBadge);
    },
});

//model for getting a badge
model.Badge = Bookshelf.Model.extend({
    tableName: 'badges',
    users: function (){
      return this.belongsToMany(model.Player);
    }
});

//model for the game host
model.Host = Bookshelf.Model.extend({
    tableName: 'users',
    questions: function (){
      return this.hasMany(model.Question);
    },
    decks: function (){
      return this.hasMany(model.Deck);
    },
});

//model for questions
model.Question = Bookshelf.Model.extend({
    tableName: 'questions',
    catagory: function (){
      return this.belongsTo(model.Catagory);
    },
    decks: function (){
      return this.belongsToMany(model.Deck).through(model.DeckQuestion);
    },
    flags: function (){
      return this.hasMany(model.Flag);
    }
});

//model for catagories
model.Catagory = Bookshelf.Model.extend({
    tableName: 'catagories',
});

//model for decks
model.Deck = Bookshelf.Model.extend({
    tableName: 'decks',
    questions: function (){
      return this.belongsToMany(model.Question).through(model.DeckQuestion);
    }
});

//model for deckQuestions
model.DeckQuestion = Bookshelf.Model.extend({
    tableName: 'deck_questions',
});

//model for flags
model.Flag = Bookshelf.Model.extend({
    tableName: 'flags'
});

//collection for getting all players
model.Players = Bookshelf.Collection.extend({
  model: model.Player,
});

//collection for getting all questions
model.Questions = Bookshelf.Collection.extend({
  model: model.Question,
})


module.exports = model;
