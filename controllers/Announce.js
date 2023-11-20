'use strict';

var utils = require('../utils/writer.js');
var Announce = require('../service/AnnounceService');

module.exports.addAnnounce = function addAnnounce (req, res, next, body) {
  Announce.addAnnounce(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteAnnounce = function deleteAnnounce (req, res, next, announceId) {
  Announce.deleteAnnounce(announceId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllAnnounces = function getAllAnnounces (req, res, next) {
  Announce.getAllAnnounces()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAnnounceById = function getAnnounceById (req, res, next, announceId) {
  Announce.getAnnounceById(announceId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateAnnounce = function updateAnnounce (req, res, next, body, announceId) {
  Announce.updateAnnounce(body, announceId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
