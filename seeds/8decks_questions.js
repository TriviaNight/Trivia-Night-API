
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('deck_questions').del(),

    // Inserts seed entries
    knex('deck_questions').insert({question_id: 1, deck_id: 1}),
    knex('deck_questions').insert({question_id: 2, deck_id: 1}),
    knex('deck_questions').insert({question_id: 3, deck_id: 1}),
  ]);
};
