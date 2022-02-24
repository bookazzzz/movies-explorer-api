require('dotenv').config();
const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes');
const usersRout = require('./routes/users');
const movieRout = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const centralError = require('./middlewares/centralError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { userLoginValidation, userSignupValidation } = require('./middlewares/validation');

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

app.post('/signin', celebrate(userLoginValidation), login);
app.post('/signup', celebrate(userSignupValidation), createUser);

app.use(auth);
app.use('/users', usersRout);
app.use('/movies', movieRout);
app.use(routes);

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(errorLogger);
app.use(errors());
app.use(centralError);
app.listen(PORT, () => {
  console.log(`Актуальная ссылка на сервер: http://localhost:${PORT}`);
});
