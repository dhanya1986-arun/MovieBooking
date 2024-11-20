// models/User.js

const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence')(mongoose);  
// Define the Coupens Schema
const couponSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  discountValue: { type: Number, required: true }
});


// Define the Booking Requests Schema
const bookingRequestSchema = new mongoose.Schema({
  reference_number: { type: Number, required: true },
  coupon_code: { type: Number, required: true },
  show_id: { type: Number, required: true },
  tickets: { type: [Number], required: true } // Array of ticket IDs
});

// Define the User Schema
const userSchema = new mongoose.Schema({
  userid: { type: Number, unique: true },
  email: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isLoggedIn: { type: Boolean, default: false },
  uuid: { type: String, required: true, unique: true },
  accesstoken: { type: String,required: true },
  coupens: [couponSchema], // Array of coupons
  bookingRequests: [bookingRequestSchema] // Array of booking requests
});
userSchema.plugin(mongooseSequence, {
  inc_field: 'userid', // Auto-increment field
  start_seq: 3         // Set the starting value for auto-increment to 5
});

const User = mongoose.model('User', userSchema);
//const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = User;

