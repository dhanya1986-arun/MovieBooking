const express = require('express');
const movieController = require('../controllers/moviecontroller');

const router = express.Router();

//router.post('/add', movieController.addMovie); 
//router.post('/movies', movieController.createMovie);

router.get('/movies', movieController.findAllMovies);
router.get('/movies/:movieId', movieController.findOne);
//router.get('/',movieController.findShows);

// 3. Get shows for a specific movie
router.get('/movies/:movieId/shows', movieController.findShows);

module.exports = router;
