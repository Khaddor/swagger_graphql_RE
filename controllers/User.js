'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.userLogin = function userLogin (req, res, next, body) {
  User.userLogin(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userLogout = function userLogout (req, res, next) {
  User.userLogout()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userSignup = function userSignup (req, res, next, body) {
  User.userSignup(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
