const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const InaccurateDataError = require('../errors/InaccurateDataError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, SECRET_KEY } = process.env;
const { MODE_PRODUCTION, DEV_KEY } = require('../utils/other');

function createUser(req, res, next) {
  const {
    name, password, email,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, password: hash, email,
    }))
    .then((user) => {
      const { _id } = user;

      return res.status(201).send({
        name, email, _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким электронным адресом уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при регистрации пользователя'));
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  User
    .findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      const token = jwt.sign(
        { userId },
        NODE_ENV === MODE_PRODUCTION ? SECRET_KEY : DEV_KEY,
        { expiresIn: '7d' },
      );

      return res.send({ token });
    })
    .catch(next);
}

function getCurrentUser(req, res, next) {
  const { userId } = req.user;

  User
    .findById(userId)
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
}

const setUser = (req, res, next) => {
  const { name, email } = req.body;
  const { userId } = req.user;

  User
    .findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при обновлении профиля пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  setUser,
  getCurrentUser,
};
