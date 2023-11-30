const router = require('express').Router();
const { validateMovieId, validateNewMovie } = require('../utils/validation');
const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovie);

router.post('/', validateNewMovie, createMovie);

router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
