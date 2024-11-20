
const Artist = require('../models/artistmodelcopy');

exports.findAllArtists = async (req, res) => {
   
   let artists;
   artists=await Artist.find();
   res.json(artists);
  };