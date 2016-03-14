exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(users){
    users.increments().primary();
    users.string('email').unique().notNullable();
    users.string('profile_name').unique();
    users.string('image_url');
    users.integer('rating').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
