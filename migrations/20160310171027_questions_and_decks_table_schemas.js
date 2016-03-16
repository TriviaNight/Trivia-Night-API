exports.up = function(knex, Promise) {
    return knex.schema.createTable('catagories', function(catagories){
      catagories.increments().primary();
      catagories.string('name');
      catagories.string('color');
    }).createTable('questions', function(questions){
    questions.increments().primary();
    questions.string('question').notNullable();
    questions.string('response_a').notNullable();
    questions.string('response_b').notNullable();
    questions.string('response_c');
    questions.string('response_d');
    questions.string('response_e');
    questions.string('correct_answer').notNullable();
    questions.integer('catagory_id').references('id').inTable('catagories').onDelete('cascade').notNullable();
    questions.integer('user_id').references('id').inTable('users').onDelete('cascade').notNullable();
  }).createTable('flags', function(flags){
    flags.increments().primary();
    flags.unique(['user_id','question_id']);
    flags.integer('user_id').references('id').inTable('users').onDelete('cascade');
    flags.integer('question_id').references('id').inTable('questions').onDelete('cascade');
  }).createTable('decks', function(decks){
    decks.increments().primary();
    decks.integer('user_id').references('id').inTable('users');
    decks.string('name');
  }).createTable('deck_questions', function(deckQuestions){
    deckQuestions.increments();
    deckQuestions.integer('question_id').references('id').inTable('question').onDelete('cascade');
    deckQuestions.integer('deck_id').references('id').inTable('decks').onDelete('cascade');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('deck_questions').dropTable('decks').dropTable('questions').dropTable('catagories');
};
