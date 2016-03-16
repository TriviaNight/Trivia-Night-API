
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('game_decks').del(),
    // Inserts seed entries
    knex('game_decks').insert({deck_id: 1, game_id: 1}),
  ]);
};
