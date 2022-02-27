require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('./middlewares/rateLimit');
const routes = require('./routes');
const centralError = require('./middlewares/centralError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  PORT = 3000,
  NODE_ENV,
  MONGO_URL,
  DEFAULT_URL = 'mongodb://localhost:27017/moviesdb',
} = process.env;

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://bookadiplom.nomoredomains.work',
    'https://bookadiplom.nomoredomains.work',
    'http://apibookadiplom.nomoredomains.work',
    'https://apibookadiplom.nomoredomains.work',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(requestLogger); // логи запросов
app.use(rateLimit); // ограничение запросов с 1 ip
app.use(helmet());
app.use(routes);

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : DEFAULT_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
app.use(errorLogger);
app.use(errors());
app.use(centralError);
app.listen(PORT);
