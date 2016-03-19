// Update with your config settings.
require('dotenv').load();

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'trivia_night',
      user:     'trivia_night_app',
      password: 'password'
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 15,
    }
  },

};
