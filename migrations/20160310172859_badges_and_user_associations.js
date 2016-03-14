
exports.up = function(knex, Promise) {
  return knex.schema.createTable('badges', function(badges){
    badges.increments().primary();
    badges.string('name');
    badges.string('description');
    badges.string('image_url');
  }).createTable('user_badges', function(userBadges){
    userBadges.increments().primary();
    userBadges.integer('user_id').references('id').inTable('users').onDelete('cascade');
    userBadges.integer('badge_id').references('id').inTable('badges').onDelete('cascade');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_badges').dropTable('badges');
};
