
const Genre = require('../models/genremodel');

exports.findAllGenres = async (req, res) => {
   // res.send('Get all genres');

    const genres = await Genre.find();
    res.json(genres);
  };