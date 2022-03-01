const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const BadRequest = require('../errors/BadRequest');

const UrlRegular = (v) => {
  if (!validator.isURL(v, { require_protocol: true })) {
    throw new BadRequest('Ошибка 400 - Ссылка имеет неправильный формат');
  }
  return v;
};

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.number().required().min(2),
    year: Joi.string().required().min(2),
    description: Joi.string().required().min(2),
    image: Joi.string().required().custom(UrlRegular),
    trailerLink: Joi.string().required().custom(UrlRegular),
    thumbnail: Joi.string().required().custom(UrlRegular),
    movieId: Joi.number().required().min(1),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
  }),
}), createMovie);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = router;
