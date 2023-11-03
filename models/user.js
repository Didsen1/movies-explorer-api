const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Требуется ввести электронный адрес',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    name: {
      required: true,
      type: String,
      minlength: 2,
      maxlength: 30,
    },

  },

  {
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (!user) throw new UnauthorizedError('Неверные почта или пароль');
            return bcrypt.compare(password, user.password)
              .then((matched) => {
                if (!matched) throw new UnauthorizedError('Неверные почта или пароль');

                return user;
              });
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
