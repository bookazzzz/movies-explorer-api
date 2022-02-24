const router = require('express').Router();
const { celebrate } = require('celebrate');

const {
  getCurrentUser,
  updateUser,
  logout
} = require('../controllers/users');

const { userUpdateDataValidation } = require('../middlewares/validation');


router.get('/me', getCurrentUser);
router.patch('/me', celebrate(userUpdateDataValidation), updateUser);
router.delete('/signout', logout);

module.exports = router;
