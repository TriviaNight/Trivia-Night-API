exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(users){
    users.increments().primary();
    users.string('user_name').unique();
    users.string('image_url');
    users.integer('rating');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
