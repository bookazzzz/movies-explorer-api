const Movie = require('../models/movie');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/pageNotFoundError');
const ForbiddenError = require('../errors/forbiddenError');

// Все фильмы
const getMovies = (req, res, next) => {
  const id = req.user._id;

  Movie.find({ owner: id }).select('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

// Создаем фильм
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const id = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: id,
  })
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Ошибка 404 - Данные переданы неправильно'));
      } else {
        res.send(movie);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationErorr') {
        next(new BadRequest('Ошибка 400 - Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Удаляем фильм
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(new Error('NotFound'))
    .then((movie) => {
      const movieUserId = movie.owner.toString();
      const UserId = req.user._id;
      if (movieUserId !== UserId) {
        throw new ForbiddenError('Ошибка 403 - ограничение или отсутствие доступа');
      }
      return movie.remove()
        .then(() => res.send({ message: 'Фильм удален' }));
    })
    .catch((error) => {
      if (error.message === 'NotFound') {
        throw new NotFoundError('Ошибка 404 - Данные переданы неправильно');
      } else if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
