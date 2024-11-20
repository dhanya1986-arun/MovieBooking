// userController.js

// Importing the necessary modules
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');  // To generate UUIDs
//const token = crypto.randomBytes(64).toString('base64') // To generate tokens
const bcrypt = require('bcryptjs');
const {b2a} = require('b2a');  // For base encoding/decoding

const User = require('../models/usermodel');  // Assuming User schema is defined in models/User.js
const tokenSecret = crypto.randomBytes(64).toString('hex');
const mongoose = require('mongoose');

const signUp = async (req, res) => {
  try {
    const { first_name,last_name, email, contact, password } = req.body;
 
    
 
    let user=await User.findOne({email});
    if(user) return res.status(400).json({message:"user exists"});

    const salt=await bcrypt.genSalt(10);
     const hashpassword = await bcrypt.hash(password,salt);

    // Generate the username by combining first and last name
    const username = `${first_name}${last_name}`;

    const uuid =  uuidv4();
     console.log('Generated UUID:', uuid);
   
     console.log('User Data:', { first_name, last_name, email, contact, hashpassword, uuid });

  
    const newUser = new User({first_name,last_name,
      username,
      email,
      contact,
      password: hashpassword,
      role: 'user',  // Default role can be user or as per requirement
      uuid:uuid,
      accesstoken:" ",
      isLoggedIn: false,
      coupens: [],
      bookingRequests: []}
     
    )
    await newUser.save();
    const token=jwt.sign({id:newUser._id},tokenSecret,{expiresIn:'2h'})

    
 
    return res.status(201).json({
      message: 'User created successfully',
      user: newUser, token,uuid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating user' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
   const isMatch=await bcrypt.compare(password,user.password);

   if(!isMatch) return res.status(401).json({message:"invalid user"});

    const token= jwt.sign({id:user._id},tokenSecret,{expiresIn:'2h'});
    //const uuid=user.uuid;
   user.isLoggedIn=true;
   await user.save();
    return res.status(200).json({
      message: 'Login successful',
      token,
      uuid:user.uuid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error during login' });
  }
};

const logout = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the user by UUID
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mark the user as logged out
    user.isLoggedIn = false;
    //user.uuid = '';
    //user.accessToken = '';
    req.token=" ";
    req.accesstoken=" ";
    user.token= " ";
    // Save the updated user session
    await user.save();

    return res.status(200).json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error during logout' });
  }
};


const getCouponCode  = async (req, res) => {

  try {
    const { uuid, discountValue } = req.body;

    if (!uuid || discountValue === undefined) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    const user = await User.findOne({ uuid });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 4-digit coupon ID
    const generateCouponId = () => Math.floor(1000 + Math.random() * 9000);

    const newCoupon = {
        id: generateCouponId(),
        discountValue,
    };

    user.coupens.push(newCoupon);
    await user.save();

    return res.status(201).json({
        message: 'Coupon added and retrieved successfully',
        coupons: user.coupons,
    });
} catch (error) {
    console.error('Error in getCouponCode:', error);
    res.status(500).json({ message: 'Internal server error' });
}
};


const getUserCoupons = async (req, res) => {
  try {
    const { couponCode } = req.params;

    if (!couponCode) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

      const user = await User.findOne({ 'coupens.id': parseInt(couponCode) });

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
 
    const coupon = await user.coupens.find(coupon => coupon.id === parseInt(couponCode));

    // Access and return the coupons array
   if (coupon) {
      return res.status(200).json({
        message: 'Coupon retrieved successfully',
        coupon,
      });
    }

    return res.status(404).json({ message: 'Coupon not found' });

  } catch (error) {
    console.error('Error retrieving user coupons:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const bookShow = async (req, res) => {
  try {
    console.log('Received request:', req.body);

    const { uuid, bookingRequest } = req.body;
    const { show_id, tickets, coupon_code } = bookingRequest;
     // const { uuid, show_id, tickets, coupon_code } = req.body;

      console.log('Parsed values:', { uuid, show_id, tickets, coupon_code });

      console.log('uuid',uuid);
      console.log('show_id',show_id);
      console.log('tickets',tickets);
      console.log('coupon_code',coupon_code);
      if (!uuid || !show_id || !tickets || !Array.isArray(tickets) ) {
      //  if (!uuid || !show_id || !tickets  || tickets.length === 0) {
         return res.status(400).json({ message: 'Invalid requst parameters' });
      }

      const user = await User.findOne({ uuid });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
   // console.log(user);
      let discountValue = 0;
      if (coupon_code) {
          const coupon =  user.coupens.find((c) => c.id == coupon_code);
          //const coupon = user.coupens.find((c) => c.id === Number(coupon_code)); 
          if (!coupon) {
              return res.status(400).json({ message: 'Invalid coupon code' });
          }
          discountValue = coupon.discountValue;

         // user.coupens =  user.coupens.filter((c) => c.id !== coupon_code);
         user.coupens = user.coupens.find((c) => c.id === Number(coupon_code));  // Ensure type match

      }


      const reference_number = Math.floor(100000 + Math.random() * 900000);

      user.bookingRequests.push({
          reference_number,
          coupon_code,
          show_id,
          tickets,
      });

      await user.save();

      return res.status(201).json({
          message: 'Booking successful',
          bookingDetails: {
              reference_number,
              show_id,
              tickets,
              discountApplied: discountValue,
          },
      });
  } catch (error) {
      console.error('Error in bookShow:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
 

module.exports = {
  signUp,
  login,
  logout,
  getCouponCode ,
  getUserCoupons,
  bookShow
};
