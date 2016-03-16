
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('game_users').del(),

    // Inserts seed entries
    knex('game_users').insert({user_id: 1, game_id: 1}),
    knex('game_users').insert({user_id: 2, game_id: 1}),
    knex('game_users').insert({user_id: 3, game_id: 1}),
  ]);
};
