
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', function(games){
    games.increments().primary();
    games.string('config');
    games.timestamp('played_on').defaultTo(knex.fn.now());
  }).createTable('game_decks', function(gameDecks){
    gameDecks.increments();
    gameDecks.integer('game_id').references('id').inTable('games');
    gameDecks.integer('deck_id').references('id').inTable('decks');
  }).createTable('game_users', function(gameUsers){
    gameUsers.increments();
    gameUsers.integer('game_id').references('id').inTable('games');
    gameUsers.integer('user_id').references('id').inTable('users');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games').dropTable('game_decks').dropTable('game_users');
};
