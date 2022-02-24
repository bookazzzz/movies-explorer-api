const router = require('express').Router();
const { celebrate } = require('celebrate');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

const { userCreateMovieValidation, userDeleteMovieValidation} = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', celebrate(userCreateMovieValidation), createMovie);
router.delete('/:movieId', celebrate(userDeleteMovieValidation), deleteMovie);

module.exports = router;
