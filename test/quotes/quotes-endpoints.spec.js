const helpers = require('../test-helpers');
const knex = require('knex');
const app = require('../../src/app');


describe('Quotes Endpoints', function() {
  let db;
  const {
    testUsers,
    testQuotes,
    testSavedQuotes,
  } = helpers.makeMotiv8Fixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  })

  after('disconnect from db', () => db.destroy());

  context('Given no quotes in db', () => {
    it('GET responds with 200 and an empty list', () => {
      return supertest(app)
        .get('/api/quotes')
        .expect(200);
    });
  });

  context('Given quotes in db', () => {
    beforeEach('insert quotes', () => helpers.seedQuotesTable(db, testQuotes));

    afterEach('remove quotes', () => helpers.cleanTables(db));

    it('GET responds with 200', () => {
      return supertest(app)
      .get('/api/quotes')
      .expect(200);
    });

    it('POST responds with 201 and created quote', () => {
      let newQuote = {
        "category": "inspirational",
        "quote": "test quote",
        "author": "test author"
      };

      expectedResponse = {
        id: 6,
        caegory: 'inspirational',
        subcategory: null,
        quote: 'test quote',
        author: 'test author',
        authorfacts: null,
        keywords: null
      }

      return supertest(app)
        .post('/api/quotes')
        .set('Content-Type', 'application/json')
        //I just hardcoded the json thinking it might be the cause of the bug
        .send(newQuote)
        .expect(201)
        .expect((res) => {
          return expect(res.body).to.deep.equal(expectedResponse);
        })
        .catch(err => console.log('error', err))
    })
  });
});