'use strict';
const Announce = require('../models/annonces'); // Make sure to replace './models/announce' with the actual path to your Announce model


/**
 * Create an announcement
 * Create a new real estate announcement
 *
 * body Announce New real estate announcement details
 * returns Announce
 **/
exports.addAnnounce = function(body) {
  return new Promise(function(resolve, reject) {
    const newAnnounce = new Announce(body);
    newAnnounce.save()
        .then(savedAnnounce => {
          resolve(savedAnnounce);
        })
        .catch(err => {
          console.error('Error saving announcement:', err);
          reject(err);
        });
  });
}


/**
 * Delete an announcement by ID
 * Delete an announcement
 *
 * announceId String The ID of the announcement to be deleted
 * no response value expected for this operation
 **/
exports.deleteAnnounce = function(announceId) {
  return new Promise(function(resolve, reject) {
    Announce.findByIdAndDelete(announceId)
        .then(deletedAnnounce => {
          if (!deletedAnnounce) {
            // If no announcement was found with the given ID
            return reject({ message: 'Announcement not found', status: 404 });
          }
          resolve(deletedAnnounce);
        })
        .catch(err => {
          reject(err);
        });
  });
}



/**
 * Get all announcements
 * Get all real estate announcements from the database
 *
 * returns List
 **/
exports.getAllAnnounces = function() {
  return new Promise(function(resolve, reject) {
    Announce.find()
        .then(announcements => {
          // If there are no announcements, you can resolve with an empty array
          const examples = announcements.length > 0 ? announcements : [];
          resolve(examples);
        })
        .catch(err => {
          reject(err);
        });
  });
}


/**
 * Get an announcement by ID
 * Returns a single real estate announcement
 *
 * announceId String ID of the announcement to return
 * returns Announce
 **/
exports.getAnnounceById = function(announceId) {
  return new Promise(function(resolve, reject) {
    Announce.findById(announceId)
        .then(announce => {
          if (!announce) {
            // If no announcement found with the given ID, resolve with null or handle as needed
            resolve(null);
          } else {
            // If an announcement is found, resolve with the announcement object
            resolve(announce);
          }
        })
        .catch(err => {
          reject(err);
        });
  });
}


/**
 * Update an announcement by ID
 * Update an existing real estate announcement
 *
 * body Announce Updated real estate announcement details
 * announceId String ID of the announcement to be updated
 * returns Announce
 **/
exports.updateAnnounce = function(body, announceId) {
  return new Promise(function(resolve, reject) {
    Announce.findByIdAndUpdate(announceId, body, { new: true })
        .then(updatedAnnounce => {
          if (!updatedAnnounce) {
            // If no announcement was found with the given ID
            return reject({ message: 'Announcement not found', status: 404 });
          }
          resolve(updatedAnnounce);
        })
        .catch(err => {
          reject(err);
        });
  });
}

