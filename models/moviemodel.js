const mongoose = require('mongoose');

/*const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: [String], required: true },
  artist: { type: [String], required: true },
  status: {
    type: String,
    enum: ['PUBLISHED', 'RELEASED'],
    required: true,
  },
  start_date: { type: Date },
  end_date: { type: Date },
});

module.exports = mongoose.model('Movie', movieSchema);*/
const { Schema }=mongoose;
//const  Artist = require('./artistmodel');
const artistSchema=require('./artistmodel');
const showSchema = require('./showmodel'); 

const movieSchema = new Schema({
  movieid: { type: Number, required: true },
  title: { type: String, required: true },
  published: { type: Boolean, required: true },
  released: { type: Boolean, required: true },
  poster_url: { type: String, required: true },
  release_date: { type: Date, required: true },  // Store as Date for better querying
  publish_date: { type: Date, required: true },  // Store as Date for better querying
  artists:[artistSchema], // Nested Artist schema
  genres: { type: [String], required: true },
  duration: { type: Number, required: true },  // Duration in minutes
  critic_rating: { type: Number, required: true },
  trailer_url: { type: String, required: true },
  wiki_url: { type: String, required: true },
  story_line: { type: String, required: true },
  shows: [showSchema] // Nested Show schema
});

module.exports = mongoose.model('Movie', movieSchema);
//module.exports = movieSchema

//artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }]
 
/*
artists:[{
    type: mongoose.Schema.Types.ObjectId, // Correct reference type
    ref: Artist // Name of the related model
  }],
*/
