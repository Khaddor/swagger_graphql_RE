'use strict';
const User = require('../models/user-models'); // Replace './models/user' with the actual path to your User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
/**
 * User login
 * Log in a user and receive a JWT token
 *
 * body Api_login_body User login details (optional)
 * returns inline_response_200
 **/
exports.userLogin = function(body) {
  return new Promise(function(resolve, reject) {
    // Assuming body contains user credentials like email and password
    const { email, password } = body;

    // Perform user authentication (replace this with your authentication logic)
    User.findOne({ email, password })
        .then(user => {
          if (!user) {
            // User not found or incorrect credentials
            reject({ message: 'Invalid email or password' });
          } else {
            // User authenticated, generate JWT token
            const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });
            // Return the user and token in the response
            resolve({ user, token });
          }
        })
        .catch(err => {
          // Handle any errors that occur during the authentication process
          reject(err);
        });
  });
}


/**
 * User logout
 * Log out a user
 *
 * no response value expected for this operation
 **/
exports.userLogout = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * User sign-up
 * Register a new user and receive a JWT token
 *
 * body Api_signup_body User registration details (optional)
 * returns inline_response_200
 **/
exports.userSignup = function(body) {
    return new Promise(async function(resolve, reject) {
        // Assuming body contains user registration details like email, password, etc.
        const { email, password, nom, prenom, username } = body;

        try {
            // Check if the user with the provided email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                reject({ message: 'User with this email already exists' });
                return;
            }

            // Hash the password before saving it to the database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user instance
            const newUser = new User({
                email,
                password: hashedPassword,
                nom,
                prenom,
                username,
                role: 'user' // Assuming a default role for a new user
                // Additional fields can be added based on your user model
            });

            // Save the new user to the database
            const savedUser = await newUser.save();

            // Generate JWT token for the newly registered user
            const token = jwt.sign({ userId: savedUser._id }, 'yourSecretKey', { expiresIn: '1h' });

            // Return the user and token in the response
            resolve({ user: savedUser, token });
        } catch (error) {
            // Handle any errors that occur during the signup process
            reject(error);
        }
    });
}

