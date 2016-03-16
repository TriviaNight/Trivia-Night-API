
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('rounds').del(),

    // Inserts seed entries
    knex('rounds').insert({question_id: 1, game_id: 1}),
    knex('rounds').insert({question_id: 2, game_id: 1}),
    knex('rounds').insert({question_id: 3, game_id: 1}),
  ]);
};
