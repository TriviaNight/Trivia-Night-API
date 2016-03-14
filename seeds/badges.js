
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('badges').del(),

    // Inserts seed entries
    knex('badges').insert({name: 'Sunburn? you look a little warm', description: 'You have correctly answered 5 questions in a row'}),
    knex('badges').insert({name: 'Catching fire', description: 'You have correctly answered 10 questions in a row'}),
    knex('badges').insert({name: "I'm gonna get a bucket because your on fire", description: 'You have correctly answered 25 questions in a row'}),
    knex('badges').insert({name: 'Is this still fun', description: 'You have correctly answered 100 questions in a row'}),
    knex('badges').insert({name: 'Pop the bubbly', description: 'You have won your first game'}),
    knex('badges').insert({name: 'Trivia guru', description: 'You have won 5 games in a row'}),
    knex('badges').insert({name: 'Trivia master', description: 'You have won 10 games in a row'}),
    knex('badges').insert({name: 'Trivia god', description: 'You have won 20 games in a row'}),
    knex('badges').insert({name: 'Big fish, big ocean', description: 'Won and game with at least 20 players'}),
    knex('badges').insert({name: 'Big fish, small pond', description: 'Won and game with under 5 players'}),

  ]);
};
