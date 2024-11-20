const http = require('http');
const url = require('url');

const mongoose = require("mongoose");
//const connectDB  = require("./config/dbconfig"); // Import dbConfig
require('dotenv').config();  
//connectDB();
const express = require('express');
const cors = require('cors');


// Create an Express app
const app = express();

// Enable CORS
//app.use(cors());
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow the React app (frontend) origin
  methods: 'GET, POST, PUT, DELETE', // Allow the HTTP methods needed
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cache-Control',  // Allow Cache-Control header
  ], 
  credentials: true, // Allow credentials like cookies, tokens, etc.
};

app.use(cors(corsOptions)); 

// Set the port
//app.use(cors());
/*app.use(cors({
  origin: 'http://localhost:3000',  // This allows requests from the React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow headers like content-type or authorization
}));*/
const PORT = process.env.PORT || 8085;
mongoose.connect('mongodb://localhost:27017/moviesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
  

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Upgrad Movie booking application development." });
});


// Import route files
const movieRoutes = require('./routes/movieroutes');
const genreRoutes = require('./routes/genreroutes');
const artistRoutes = require('./routes/artistroutes');
const userRoutes = require('./routes/userroutes');
const auth=require('./middleware/auth');
//const authRoutes=require('./routes/userroutes');
// Use the routes
app.use('/api', movieRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api', userRoutes);
//app.use('/api/auth',authRoutes);
//app.use('/api/shows',movieRoutes);

app.get('/api/protected', auth ,(req,res)=>{
  res.json({message:"welcome to a protected route"});
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
