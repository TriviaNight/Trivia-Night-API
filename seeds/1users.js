
exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert({
      profile_name: 'Mad Mike',
      email: 'm.yeager001@gmail.com',
      image_url: 'https://lh5.googleusercontent.com/-z8Rv5svpDoU/AAAAAAAAAAI/AAAAAAAAAVM/hR5eR81ACX8/photo.jpg?sz=50',
      rating: 4490,
    }),
    knex('users').insert({
      profile_name: 'myeager',
      email: 'm.yeager@nowhere.com',
      image_url: 'https://photos.google.com/photo/AF1QipOMI2E1udpIHxcqPQe9YTZ8NyCcxyQLtO5UEGV8',
      rating: 2240,
    }),
    knex('users').insert({
      profile_name: 'lhyeager',
      email: 'lhyeager@nowhere.com',
      image_url: 'https://photos.google.com/photo/AF1QipOMI2E1udpIHxcqPQe9YTZ8NyCcxyQLtO5UEGV8',
      rating: 2455,
    }),
    knex('users').insert({
      profile_name: 'dagerknife',
      email: 'dagerknife@nowhere.com',
      image_url: 'https://photos.google.com/photo/AF1QipOMI2E1udpIHxcqPQe9YTZ8NyCcxyQLtO5UEGV8',
      rating: 1290,
    }),

  ]);
};
