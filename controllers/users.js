const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const UnauthorizedError = require('../errors/unauthorizedError');
const NotFoundError = require('../errors/pageNotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

// Создаем пользователя
const createUser = (req, res, next) => {
  const {
    name,
    email
  } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const data = JSON.parse(JSON.stringify(user));
      delete data.password;
      res.status(200).send({ data });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(`Произошла ошибка: ${err} Переданы некорректные данные при создании пользователя`));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

// Обновление профия
const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User
    .findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true, })
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Введены некорректные данные!'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Нет пользователя с таким _id'));
      } else {
        next(err);
      }
    });
};

// контроллер логина
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('передан неверный логин или пароль.'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('передан неверный логин или пароль.'));
          }

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
            { expiresIn: '7d' },
          );
          return res.send({ token });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные в email или password.'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .orFail(() => {
    throw new NotFoundError('Пользователь не найден');
  })
  .then((user) => res.status(200).send({ user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequest('Переданы некорректные данные');
    } else if (err.name === 'NotFoundError') {
      throw new NotFoundError('Пользователь не найден');
    } else {
      next(err);
    }
  });

//Контроллер выхода
  const logout = (req, res, next) => {
    User.findOne({ _id: req.user._id })
      .then(() => res.clearCookie('jwt').send({}))
      .catch(next);
  };


module.exports = {
  createUser,
  updateUser,
  login,
  getCurrentUser,
  logout
};
