const express = require('express');
const genreController = require('../controllers/genrecontroller');

const router = express.Router();

// Route to get all genres
router.get('/', genreController.findAllGenres);

module.exports = router;
