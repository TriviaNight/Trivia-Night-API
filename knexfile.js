// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'trivia_night',
      user:     'trivia_night_app',
      password: 'password'
    },
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
  },

};
