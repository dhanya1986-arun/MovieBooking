const express = require('express');
const artistController = require('../controllers/artistcontroller');

const router = express.Router();

// Route to get all artists
router.get('/', artistController.findAllArtists);

module.exports = router;
