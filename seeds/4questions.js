
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('questions').del(),

    // Inserts seed entries
    knex('questions').insert({
      question: 'What score does Smokey tell the Dude to mark it in the argument with Walter?',
      response_a: '9',
      response_b: '6',
      response_c: '7',
      response_d: '8',
      response_e: 'spare',
      correct_answer: 'D',
      catagory_id: 3,
      user_id: 1,
      bullshit_rating: 0,
    }),
    knex('questions').insert({
      question: 'What is the Dude call his white russians?',
      response_a: 'Causasian',
      response_b: 'Blind Russian',
      response_c: 'Commie',
      response_d: 'Anna Kournikova ',
      correct_answer: 'A',
      catagory_id: 3,
      user_id: 1,
      bullshit_rating: 0,
    }),
    knex('questions').insert({
      question: "What is the Dude's real first name?",
      response_a: 'Mark',
      response_b: 'Gregory',
      response_c: 'Sebastian',
      response_d: 'Donald',
      response_e: 'Jeffrey',
      correct_answer: 'E',
      catagory_id: 3,
      user_id: 1,
      bullshit_rating: 0,
    })
  ]);
};
