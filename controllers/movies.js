const Movie = require('../models/movie');

const InaccurateDataError = require('../errors/InaccurateDataError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

function getMovie(req, res, next) {
  const { userId } = req.user;

  Movie
    .find({ owner: userId })
    .then((movies) => {
      if (movies) return res.send({ movies });

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

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  const { userId } = req.user;

  Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: userId,
      movieId,
      nameRU,
      nameEN,
    })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
}

function deleteMovie(req, res, next) {
  const { movieId } = req.params;
  const { userId } = req.user;

  Movie
    .findById(movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError('Данные по указанному id не найдены');

      const { owner: movieOwnerId } = movie;
      if (movieOwnerId.valueOf() !== userId) throw new ForbiddenError('Нет прав доступа');

      Movie.deleteOne(movie).then(() => res.status(200).send({ data: movie })).catch(next);
    })
    .catch(next);
}

module.exports = {
  getMovie,
  createMovie,
  deleteMovie,
};
