
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('catagories').del(),

    // Inserts seed entries
    knex('catagories').insert({name: 'Entertainment', color: 'red'}),
    knex('catagories').insert({name: 'Sports', color: 'green'}),
    knex('catagories').insert({name: 'History', color: 'blue'}),
    knex('catagories').insert({name: 'News and Politics', color: 'yellow'}),
    knex('catagories').insert({name: 'Math and Science', color: 'purple'}),
    knex('catagories').insert({name: 'Other', color: 'orange'}),
  ]);
};
