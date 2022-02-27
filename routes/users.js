const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser,
  updateUser,
  logout,
} = require('../controllers/users');

// const { userUpdateDataValidation } = require('../middlewares/validation');

router.get('/me', getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

router.delete('/signout', logout);

module.exports = router;
