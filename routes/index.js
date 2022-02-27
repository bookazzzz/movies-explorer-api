const router = require('express').Router();
const NotFoundError = require('../errors/pageNotFoundError');
const usersRout = require('./users');
const routerMovie = require('./movies');
const routerAuth = require('./authroutes');
const auth = require('../middlewares/auth');

router.use(routerAuth);
router.use(auth);
router.use('/users', usersRout);
router.use('/movies', routerMovie);
router.all('*', (res, req, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

module.exports = router;
