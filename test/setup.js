process.env.JWT_SECRET = 'secret-test-password';
process.env.NODE_ENV = 'test';


require('dotenv').config();
const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;