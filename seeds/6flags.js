exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('flags').del(),

    // Inserts seed entries
    knex('flags').insert({user_id: 1, question_id: 1}),
    knex('flags').insert({user_id: 2, question_id: 1}),
    knex('flags').insert({user_id: 1, question_id: 2}),
    knex('flags').insert({user_id: 1, question_id: 3}),

  ]);
};
