
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', function(games){
    games.increments().primary();
    games.string('config');
    games.timestamp('played_on').defaultTo(knex.fn.now());
  }).createTable('game_decks', function(gameDecks){
    gameDecks.increments();
    gameDecks.integer('game_id').references('id').inTable('games').onDelete('cascade');
    gameDecks.integer('deck_id').references('id').inTable('decks').onDelete('cascade');
  }).createTable('game_users', function(gameUsers){
    gameUsers.increments();
    gameUsers.integer('game_id').references('id').inTable('games').onDelete('cascade');
    gameUsers.integer('user_id').references('id').inTable('users').onDelete('cascade');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('game_users').dropTable('game_decks').dropTable('games');
};
