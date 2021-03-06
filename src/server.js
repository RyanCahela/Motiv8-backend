const app = require('./app');
const knex = require('knex');

let db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

app.set('db', db);

app.listen(process.env.PORT || 8000);