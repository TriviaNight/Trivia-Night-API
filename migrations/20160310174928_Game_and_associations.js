
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', function(games){
    games.increments().primary();
    games.integer('host_id').references('id').inTable('users').onDelete('cascade').notNullable();
    games.integer('winner_id').references('id').inTable('users').onDelete('cascade');
    games.integer('round_length_in_seconds').notNullable();
    games.integer('number_of_rounds').notNullable();
    games.string('name').notNullable();
    games.string('password').notNullable();
    games.timestamp('played_on').defaultTo(knex.fn.now());
  }).createTable('game_decks', function(gameDecks){
    gameDecks.increments();
    gameDecks.unique(['game_id', 'deck_id']);
    gameDecks.integer('game_id').references('id').inTable('games').onDelete('cascade');
    gameDecks.integer('deck_id').references('id').inTable('decks').onDelete('cascade');
  }).createTable('game_users', function(gameUsers){
    gameUsers.increments();
    gameUsers.unique(['game_id', 'user_id']);
    gameUsers.integer('game_id').references('id').inTable('games').onDelete('cascade');
    gameUsers.integer('user_id').references('id').inTable('users').onDelete('cascade');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('game_users').dropTable('game_decks').dropTable('games');
};
