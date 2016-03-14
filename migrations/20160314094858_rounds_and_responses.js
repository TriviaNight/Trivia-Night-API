
exports.up = function(knex, Promise) {
  return knex.schema.createTable('rounds', function(rounds){
    rounds.increments();
    rounds.integer('game_id').references('id').inTable('games').onDelete('cascade');
    rounds.integer('question_id').references('id').inTable('questions').onDelete('cascade');
    rounds.integer('round_number');
  }).createTable('user_responses', function(user_responses){
    user_responses.increments();
    user_responses.integer('user_id').references('id').inTable('users').onDelete('cascade');
    user_responses.integer('round_id').references('id').inTable('rounds').onDelete('cascade');
    user_responses.boolean('correct_answer');
    user_responses.timestamp('played_on').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_responses').dropTable('rounds');
};
