var Socket = require('socket.io');
var jwt = require('jsonwebtoken');
var knex = require('./db/knex');


//array of active games
var games = [];


//export socket connection
module.exports=function(server){
  //create socket
  var io = Socket(server);
  io.on('connection', function(socket){

    //host creates a game;
    socket.on('createGame', function(game){
      //check to see if game already exist
      var gameExist = CompareToActiveGames(game, 'name');

      //if game exist let creator know game exist
      if(gameExist){
        socket.emit('fail', 'Game already exist');
      }
      //else create the game in memory
      else{
        var gameModel = {
          user_id: game.host_id,
          round_length_in_seconds: game.questionTime,
          name: game.name,
          password: game.password,
          number_of_rounds: game.numberOfRounds,
        };
        //add to database
        knex('games').insert(gameModel, 'id').then(function(id){

        //create game settings
          game.id = id[0];
          game.players = {};
          game.rounds = [];
          game.activeRound = 1;

        //add to active game array
          games.push(game);
        // create and join the specific game channel
          socket.join(game.name);
          socket.emit('createdGame', 'success');
        });
      }
    });





    //player joins a game
    socket.on('joinGame', function(user){
      //get game state
      var hostGame = returnGameObject(user, 'name');
      if(hostGame){
        //ensure the game passwords match
        if(hostGame.password == user.password){

          //check if user is in database
          knex('game_users').select().where({game_id: hostGame.id, user_id: user.userID}).then(function(previousUser){
            //if rejoining the game
            if(previousUser){
              joinChannel(user, hostGame);

            //if new user to the game
            }else{
              //add user to database
              knex('game_users').insert({game_id: hostGame.id, user_id: user.userID}).then(function(){
                joinChannel(user, hostGame);
              });
            }
          })
        }else{
          //password didn't match
          socket.emit('fail', 'incorrect password.');
        }
      }else{
        //couldn't find game in game array
        socket.emit('fail', 'incorrect game name.');
      }
    });




    //host begins a round with a timer and ask question
    socket.on('ask question', function(question){
      question.host_id = question.user_id
      // make sure host is asking questions
      var isHost = CompareToActiveGames(question, 'host_id');
      if(isHost){
        //get the game state
        var hostGame = returnGameObject(question, 'host_id');
        //insert question to database
        knex('rounds').insert({game_id: hostGame.id, round_number: hostGame.activeRound, question_id: question.id},'id').then(function(id){
          question.roundID = id[0];
          hostGame.rounds[hostGame.activeRound-1] = question;
          var content = {
            choice: {},
            question: question.question
          }
          content.choice.A = question.response_a;
          content.choice.B = question.response_b;
          content.choice.C = question.response_c;
          content.choice.D = question.response_d;
          content.choice.E = question.response_e;
          content.round = hostGame.activeRound;
          //submit the question to the users
          io.in(hostGame.name).emit('question', content);
        });
        //set round length
        var timeout = hostGame.questionTime*1000;
        //when round ends
        setTimeout(function(){
          //get answers from responses
          for(var key in hostGame.players){
            //if the user responded
            if(hostGame.players[key].answers[hostGame.activeRound-1]){
              //if response matches right answer
              if(hostGame.rounds[hostGame.activeRound-1].correct_answer===hostGame.players[key].answers[hostGame.activeRound-1].choice){
                //100 points for right answer
                //give bonus points for how fast they answered
                var elapsedSec = (Date.now()-hostGame.players[key].answers[hostGame.activeRound-1].time)/1000
                var incrementer = (hostGame.questionTime/10)
                var bonusScore = Math.floor(elapsedSec/incrementer)*10
                hostGame.players[key].score += 100 + bonusScore;
                //add ansers to database
                knex('user_responses').insert({user_id: key, correct_answer: true, round_id: hostGame.rounds[hostGame.activeRound-1].roundID}).then(function(data){
                  console.log(data);
                });
              //if incorrect
              }else{
                //add answers to database
                knex('user_responses').insert({user_id: key, correct_answer: false, round_id: hostGame.rounds[hostGame.activeRound-1].roundID}).then(function(data){
                  console.log(data);
                });
              }
            //if no response from the user
            }else{
              //add answers to database
              knex('user_responses').insert({user_id: key, correct_answer: false, round_id: hostGame.rounds[hostGame.activeRound-1].roundID}).then(function(data){
                console.log(data);
              });
            }
          }

          //after updated scores
          //increment round
          hostGame.activeRound++;
          //check to see if end of game
          if(hostGame.activeRound>hostGame.numberOfRounds){
            //update game with end of game function
            var winnerId;
            var currentBestScore=0;
            for(var key2 in hostGame.players){
              if(hostGame.players[key2].score > currentBestScore){
                currentBestScore = hostGame.players[key2].score;
                winnerId = key2;
              }
            }
            //insert game winner in database
            knex('games').update({winner_id: winnerId}).where('id', hostGame.id).then(function(){
              //remove game for active games
              removeGame(hostGame);
              //send final results
              io.in(hostGame.name).emit('game over', hostGame.players);
            }).catch(function(error){
              io.in(hostGame.name).emit('game over', hostGame.players);
            });
          //if not end of game send round results back to user
          }else{
            var gameState = {
              players: hostGame.players,
              answer: hostGame.rounds[hostGame.activeRound-2].correct_answer,
            }
            io.in(hostGame.name).emit('round over', gameState
          );
          }
        }, timeout);
      //if not the game host
      }else{
        socket.emit('message', 'You are not currently hosting a game');
      }
  });





    //player submits and answer to a question
    socket.on('answer', function(userResponse){
      //get the game state
      var hostGame = returnGameObject(userResponse, 'name');
      //create a response
      var response = {
        choice: userResponse.response,
        time: Date.now(),
      }
      //check that the response is for the correct round
      if(userResponse.round === hostGame.activeRound){
        //add response to game state
        hostGame.players[userResponse.userID].answers[userResponse.round-1] = response;
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

// compares data for find matches between two games
function CompareToActiveGames(game, comparison){
  var foundComparison = false;
  games.forEach(function(hostedGame){
    if(hostedGame[comparison]===game[comparison]){
      foundComparison = true;
    }
  });
  return foundComparison;
}

//returns game state to be modified
function returnGameObject(game, comparison){
  var gameObject;
  games.forEach(function(hostedGame){
    if(hostedGame[comparison]===game[comparison]){
      gameObject = hostedGame;
    }
  });
  return gameObject;
}


//pulls game from array
function removeGame(game){
  games.forEach(function(hostedGame, i, games){
    if(game.name===hostedGame.name){
      games.splice(i, 1);
    }
  });
}

//joins game socket channel 
function joinChannel(user, hostGame){
  //join the game channel
  socket.join(user.name);

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
}
