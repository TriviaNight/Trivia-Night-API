
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('user_responses').del(),

    // Inserts seed entries
    knex('user_responses').insert({user_id: 1, round_id: 1, correct_answer: true}),
    knex('user_responses').insert({user_id: 1, round_id: 2, correct_answer: true}),
    knex('user_responses').insert({user_id: 1, round_id: 3, correct_answer: false}),
    knex('user_responses').insert({user_id: 2, round_id: 1, correct_answer: false}),
    knex('user_responses').insert({user_id: 2, round_id: 2, correct_answer: true}),
    knex('user_responses').insert({user_id: 2, round_id: 3, correct_answer: false}),
    knex('user_responses').insert({user_id: 3, round_id: 1, correct_answer: true}),
    knex('user_responses').insert({user_id: 3, round_id: 2, correct_answer: true}),
    knex('user_responses').insert({user_id: 3, round_id: 3, correct_answer: false}),
  ]);
};
