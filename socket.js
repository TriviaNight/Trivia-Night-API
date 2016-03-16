var Socket = require('socket.io');
var jwt = require('jsonwebtoken');
var knex = require('./db/knex');


//array of active games
var games = [];

module.exports=function(server){
  var io = Socket(server);
  io.on('connection', function(socket){
    socket.emit('message', 'welcome to socket channel');

    //host creates a game;
    socket.on('createGame', function(game){
      //check to see if game already exist
      var gameExist = CompareToActiveGames(game, 'name');

      //if game exist let creator know game exist
      if(gameExist){
        socket.emit('message', 'Game already exist');
      }
      //else create the game in memory add to database
      else{
        var gameModel = {
          host_id: game.hostID,
          round_length_in_seconds: game.questionTime,
          name: game.name,
          password: game.password,
          number_of_rounds: game.numberOfRounds,
        };
        knex('games').insert(gameModel, 'id').then(function(id){

          game.id = id[0];
          game.players = {};
          game.rounds = [];
          game.activeRound = 1;
          games.push(game);
          socket.join(game.name);
          setInterval(function(){
            io.in(game.name).emit('message', 'hello there from game room');
          }, 3000);
        });
      }
    });

    //player joins a game
    socket.on('joinGame', function(user){
      //find game form array of active games
      var foundGame = CompareToActiveGames(user, 'name');
      if(foundGame){
        //ensure the game passwords match
        var matchedPasswords = CompareToActiveGames(user, 'password');
        if(matchedPasswords){
          var hostGame = returnGameObject(user, 'name');
          //join the game channel
          knex('game_users').insert({game_id: hostGame.id, user_id: user.userID}).then(function(){
            socket.join(user.name);
            //get the game object
            var hostGame = returnGameObject(user, 'name');
            //add the user to game object and set score to zero
            if(!hostGame.players[user.userID]){
              hostGame.players[user.userID] = {};
              hostGame.players[user.userID].imgURL = user.imgURL;
              hostGame.players[user.userID].username = user.username;
              hostGame.players[user.userID].score = 0;
              hostGame.players[user.userID].answers = [];

            }
            //set and emit the game token
            var token = jwt.sign(user, process.env.JWT_SECRET, {
              expiresIn:15778463,
            });
            socket.emit('gameToken', token);
          });
        }else{
          //incorrect password
          socket.emit('message', 'incorrect password.');
        }
      }else{
        //couldn't find game in game array
        socket.emit('message', 'incorrect game name.');
      }
    });

    //host begins a round with a timer and ask question
    socket.on('ask question', function(question){
      var isHost = CompareToActiveGames(question, 'hostID');
      if(isHost){
        var hostGame = returnGameObject(question, 'hostID');
        knex('rounds').insert({game_id: hostGame.id, round_number: hostGame.activeRound, question_id: question.id},'id').then(function(id){
          question.roundID = id[0];
          hostGame.rounds[hostGame.activeRound-1] = question;
          io.in(hostGame.name).emit('question', question.content);
        });
      }else{
        socket.emit('message', 'You are not currently hosting a game');
      }
      //set timeout ends the round
      var timeout = hostGame.questionTime*1000;
      setTimeout(function(){
        //update scores
        for(var key in hostGame.players){
          //update database and game scores
          if(hostGame.rounds[hostGame.activeRound-1].correctAnswer===hostGame.players[key].answers[hostGame.activeRound-1]){
            knex('user_responses').insert({user_id: key, correct_answer: true, round_id: hostGame.rounds[hostGame.activeRound-1].roundID}).then(function(data){
              console.log(data);
              hostGame.players[key].score++;
            });
          }else{
            knex('user_responses').insert({user_id: key, correct_answer: false, round_id: hostGame.rounds[hostGame.activeRound-1].roundID}).then(function(data){
              console.log(data);
            });
          }
        }
        //check to see if
        //send user scores
        hostGame.activeRound++;
        if(hostedGame.activeRound>hostedGame.numberOfRounds){
          var winnerId;
          var currentBestScore=0;
          for(var key2 in hostedGame.players){
            if(hostGame.players[key2].score > currentBestScore){
              currentBestScore = hostGame.players[key2].score;
              winnerId = key2;
            }
          }
          knex('games').update({winner_id: winnerId}).where('id', hostedGame.id).then(function(){
            io.in(hostGame.name).emit('game over', hostGame.players);
          });

        }
        io.in(hostGame.name).emit('round over', hostGame.players);
      }, timeout);
    });

    //player submits and answer to a question
    socket.on('answer', function(userResponse){

      var hostGame = returnGameObject(userResponse, 'name');
      if(userResponse.round === hostGame.activeRound){
        hostGame.players[userResponse.userID].answers[userResponse.round-1] = userResponse.response;
        io.in(hostGame.name).emit('message', 'user submitted an answer');
      }else{
        socket.emit('message', 'This is not the active round');
      }
    });


    //user disconnects from entire socket
    socket.on('disconnect', function() {
      console.log('Disconected');
    });
  });
};

function CompareToActiveGames(game, comparison){
  var foundComparison = false;
  games.forEach(function(hostedGame){
    if(hostedGame[comparison]===game[comparison]){
      foundComparison = true;
    }
  });
  return foundComparison;
}

function returnGameObject(game, comparison){
  var gameObject;
  games.forEach(function(hostedGame){
    if(hostedGame[comparison]===game[comparison]){
      gameObject = hostedGame;
    }
  });
  return gameObject;
}
