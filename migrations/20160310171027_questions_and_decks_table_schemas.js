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
    questions.integer('catagory_id').references('id').inTable('catagories');
  }).createTable('decks', function(decks){
    decks.increments().primary();
    decks.integer('user_id').references('id').inTable('users');
    decks.string('name');
  }).createTable('deck_questions', function(deckQuestions){
    deckQuestions.increments();
    deckQuestions.integer('user_id').references('id').inTable('users');
    deckQuestions.integer('deck_id').references('id').inTable('decks');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('catagories').dropTable('questions').dropTable('deck_questions');
};
