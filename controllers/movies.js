const Movie = require('../models/movie');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/pageNotFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const ConflictError = require('../errors/ConflictError');

// Все фильмы
const getMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({});
    res.status(200).send(movie);
  } catch (err) {
    next(err);
  }
};

// Создаем фильм
const createMovie = async (req, res, next) => {
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
  try {
    const movie = await Movie.create({
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
      owner: req.user._id,
    });
    res.status(200).send(movie);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationErorr') {
      next(new BadRequest('Ошибка 400 - Введены некорректные данные.'));
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new ConflictError('Ошибка 409 - Фильм с таким ID уже существует.'));
    } else {
      next(err);
    }
  }
};

// Удаляем фильм
const deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  Movie.findById(_id)
    .orFail(() => new NotFoundError('Фильм по данному ID не найден.'))
    .then((movie) => {
      if (req.user._id.toString() === movie.owner.toString()) {
        movie.remove()
          .then(() => {
            res.status(200).send({ message: 'Фильм удален.' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Нельзя удалять чужой фильм.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
