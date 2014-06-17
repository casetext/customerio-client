
'use strict';

var https = require('https')
  , Q = require('q')
  , _ = require('lodash');

/**
 * A client connection to the Customer.IO API.
 * @constructor
 * @param {String} siteid - Your Customer.IO site ID.
 * @param {String} apikey - Your Customer.IO API key.
 */
function Client(siteid, apikey) {
  if (!_.isString(siteid) || !_.isString(apikey)) {
    throw new Error('Must supply both a site key and an API key');
  }

  this.siteid = siteid;
  this.secret = apikey;
}

function rejectErrors(res) {
  var deferred = this;
  if (res.statusCode === 200) {
    deferred.resolve();
  } else {
    var responseText = '';
    res
    .on('data', function(data) {
      responseText += data;
    })
    .on('end', function() {
      var errorText = responseText;
      if (res.headers['content-type'] === 'application/json') {
        errorText = JSON.parse(responseText).meta.error;
      }
      deferred.reject(new Error('customer.io returned error: "' + errorText + '"'));
    });
  }
}

/** @private */
Client.prototype._requestData = function(customerid, method, extraPath) {
  return {
    hostname: 'track.customer.io',
    path: '/api/v1/customers/' + customerid + (extraPath ? extraPath : ''),
    auth: this.siteid + ':' + this.secret,
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Connection': 'keep-alive'
    }
  };
};

/**
 * Set or update information about a user in the Customer.IO database.
 * @param {String} customerid - The user's unique ID.
 * @param {String} email - The user's email address.
 * @param {Object} data - Metadata about the user.
 * @returns {Promise} A promise resolved on success or rejected with error on failure.
 */
Client.prototype.identify = function createUser(customerid, email, data) {

  if (!customerid || !email) {
    throw new Error('must supply customerid and email');
  }

  data = _.clone(data);
  data.created_at = Date.now();
  data.email = email;

  var deferred = Q.defer()
    , meta = this._requestData(customerid, 'PUT')
    , jsonData = JSON.stringify(data);

  meta.headers['Content-Length'] = jsonData.length;

  https.request(meta, rejectErrors.bind(deferred))
  .on('error', function(e) {
    deferred.reject(e);
  })
  .end(jsonData, 'utf8');

  return deferred.promise;
};

/**
 * Remove a user from the Customer.IO database.
 * @param {String} customerid - The user's unique ID.
 * @returns {Promise} A promise resolved on success or rejected with error on failure.
 */
Client.prototype.deleteUser = function deleteUser(customerid) {

  if (!customerid) {
    throw new Error('must supply customerid');
  }

  var deferred = Q.defer();

  https.request(this._requestData(customerid, 'DELETE'), rejectErrors.bind(deferred))
  .on('error', function(e) {
    deferred.reject(e);
  })
  .end();

  return deferred.promise;
};

/**
 * Send information about a user-generated event to the Customer.IO database.
 * @param {String} customerid - The user's unique ID.
 * @param {String} name - The name of the event.
 * @param {Object} data - Any further metadata about the event.
 * @returns {Promise} A promise resolved on success or rejected with error on failure.
 */
Client.prototype.track = function track(customerid, name, data) {

  if (!customerid || !name || !_.isObject(data)) {
    throw new Error('must supply customerid, event name, and object with data to track!');
  }

  var eventObject = {};
  eventObject.name = name;
  eventObject.data = data;

  var deferred = Q.defer()
    , meta = this._requestData(customerid, 'POST', '/events')
    , jsonData = JSON.stringify(eventObject);

  meta.headers['Content-Length'] = jsonData.length;

  https.request(meta, rejectErrors.bind(deferred))
  .on('error', function(e) {
    deferred.reject(e);
  })
  .end(jsonData, 'utf8');

  return deferred.promise;
};

module.exports = Client;
