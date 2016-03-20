
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('games').del(),

    // Inserts seed entries
    knex('games').insert({user_id: 1, round_length_in_seconds: 10, number_of_rounds: 5, name: 'Thursday night triva night', password: 'password'}),
  ]);
};
