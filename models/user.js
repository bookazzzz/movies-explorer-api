const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, "Минимальная длина поля 'name' - 2 символа."],
    maxlength: [30, "Максимальная длина поля 'name' - 30 символов."],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Некорректный Email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlrngth: 8,
  },
});

module.exports = mongoose.model('user', userSchema);
