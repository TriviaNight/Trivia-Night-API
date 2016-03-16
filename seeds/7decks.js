
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('decks').del(),

    // Inserts seed entries
    knex('decks').insert({user_id: 1, name: 'The Big Lebowski trivia deck'})
  ]);
};
