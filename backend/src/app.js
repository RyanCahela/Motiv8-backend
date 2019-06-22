require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const quotesRouter = require('./quotes/quotesRouter');
const usersRouter = require('./users/usersRouter');
const saveQuoteRouter = require('./save/SaveQuoteRouter.js');
const authRouter = require('./auth/authRouter')

const app = express();

app.use(cors());
app.use(morgan());
app.use(helmet());
app.use('/api/login', authRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/users', usersRouter);
app.use('/api/savedQuotes/', saveQuoteRouter);

module.exports = app;




