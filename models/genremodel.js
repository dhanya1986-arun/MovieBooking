const mongoose = require('mongoose');
const { Schema } = mongoose;

// Genre Schema
const genreSchema = new Schema({
  genreid: { type: Number, required: true, unique: true },  // genreid should be unique
  genre: { type: String, required: true }
});

// Model creation
const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;