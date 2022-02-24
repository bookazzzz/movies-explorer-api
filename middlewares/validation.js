const { Joi, celebrate } = require('celebrate');

const UrlRegular = /(http:\/\/|https:\/\/)(www)*[a-z0-9\S]*/;

const userLoginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userSignupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userUpdateDataValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }),
});

const userCreateMovieValidation = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(UrlRegular),
    trailer: Joi.string().required().custom(UrlRegular),
    thumbnail: Joi.string().required(),
    movieId: Joi.string().min(1).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
};

const userDeleteMovieValidation = {
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
};

module.exports = {
  userLoginValidation,
  userSignupValidation,
  userUpdateDataValidation,
  userCreateMovieValidation,
  userDeleteMovieValidation,
};
