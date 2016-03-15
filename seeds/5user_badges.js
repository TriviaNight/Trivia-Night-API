
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('user_badges').del(),

    // Inserts seed entries
    knex('user_badges').insert({user_id: 1, badge_id: 2}),
    knex('user_badges').insert({user_id: 1, badge_id: 3}),
    knex('user_badges').insert({user_id: 1, badge_id: 4}),
    knex('user_badges').insert({user_id: 1, badge_id: 6}),

  ]);
};
