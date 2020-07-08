'use strict';

require('dotenv').config({ path: './variables.env' });

const connectToDatabase = require('./lib/db');
const User = require('./models/User');

module.exports.createUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    User.create(JSON.parse(event.body))
      .then((user) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(user),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not create the user.',
        })
      );
  });
};

module.exports.getUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    User.findById(event.pathParameters.id)
      .then((user) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(user),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the user.',
        })
      );
  });
};

module.exports.getAllUsers = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    User.find()
      .then((users) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(users),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the users.',
        })
      );
  });
};

module.exports.updateUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    User.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
      .then((user) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(user),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could edit the user.',
        })
      );
  });
};

module.exports.deleteUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    User.findByIdAndRemove(event.pathParameters.id)
      .then((user) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: 'Removed user with id: ' + user._id, user: user.name }),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not find user to delete.',
        })
      );
  });
};
