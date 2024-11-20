const mongoose = require('mongoose');

const { Schema }=mongoose;

/*const showSchema = new Schema({
    id: { type: Number, required: true },
    theatre: {
      name: { type: String, required: true },
      city: { type: String, required: true }
    },
    language: { type: String, required: true },
    show_timing: { type: Date, required: true },  // You can store it as a Date object for better manipulation
    available_seats: { type: Number, required: true },
    unit_price: { type: Number, required: true }
  });
  
  //module.exports = mongoose.model('Show', showSchema);
  //const Show = mongoose.model('Show', showSchema);
 // module.exports = Show;*/
 // Schema for the theater
// const theatreSchema = new mongoose.Schema({
//  name: { type: String, required: true },
//  city: { type: String, required: true },
//});
// Schema for the show
const showSchema = new mongoose.Schema({
  theater: { type: String, required: true }, 
  language: {  type: String, required: true },
  show_timing: { 
    type: Date, 
    required: true 
  },
  available_seats: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  unit_price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  // Optional: Adding a reference to the movie if needed
  movieId: { type: Number, required: true },
 
}, { timestamps: true }); // Adds createdAt and updatedAt fields

//module.exports = mongoose.model('Show', showSchema);
module.exports = showSchema;
/* movieId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Movie', 
    required: true 
  }*/