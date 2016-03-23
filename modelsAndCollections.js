var knex = require('./db/knex');
var Bookshelf = require('bookshelf')(knex);

var model = {};



//model for getting a player
model.Player = Bookshelf.Model.extend({
    tableName: 'users',
    badges: function (){
      return this.belongsToMany(model.Badge).through(model.UserBadge);
    },
    games: function (){
      return this.belongsToMany(model.Game).through(model.GameUser);
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
    games: function (){
      return this.hasMany(model.Game);
    }
});

//model for a game
model.Game = Bookshelf.Model.extend({
    tableName: 'games',
    host: function (){
      return this.belongsTo(model.Host);
    },
    players: function (){
      return this.belongsToMany(model.Player).through(model.GameUser);
    },
    rounds: function (){
      return this.hasMany(model.Round);
    },
    decks: function(){
      return this.belongsToMany(model.Deck).through(model.GameDeck)
    }

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
    },
    userResponses: function(){
      return this.hasMany(model.UserResponse).through(model.Round);
    }
});

//model for getting a badge
model.Badge = Bookshelf.Model.extend({
    tableName: 'badges',
    users: function (){
      return this.belongsToMany(model.Player);
    },
});

//model for decks
model.Deck = Bookshelf.Model.extend({
    tableName: 'decks',
    questions: function (){
      return this.belongsToMany(model.Question).through(model.DeckQuestion);
    }
});

//model for catagories
model.Catagory = Bookshelf.Model.extend({
    tableName: 'catagories',
});

//model for user badges
model.UserBadge = Bookshelf.Model.extend({
    tableName: 'user_badges',
});

//model for deckQuestions
model.DeckQuestion = Bookshelf.Model.extend({
    tableName: 'deck_questions',
});

model.GameDeck = Bookshelf.Model.extend({
    tableName: 'game_decks',
});
//model for flags
model.Flag = Bookshelf.Model.extend({
    tableName: 'flags',
});

//model for round
model.Round = Bookshelf.Model.extend({
    tableName: 'rounds',
    userResponses: function (){
      return this.hasMany(model.UserResponse);
    },
});

//model for user response
model.UserResponse = Bookshelf.Model.extend({
    tableName: 'user_responses',
});

//model for game user
model.GameUser = Bookshelf.Model.extend({
    tableName: 'game_users',
})

//collection for getting all players
model.Players = Bookshelf.Collection.extend({
  model: model.Player,
});

//collection for getting all questions
model.Questions = Bookshelf.Collection.extend({
  model: model.Question,
});


module.exports = model;
