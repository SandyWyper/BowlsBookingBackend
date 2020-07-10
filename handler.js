'use strict';

require('dotenv').config({ path: './variables.env' });

const connectToDatabase = require('./lib/db');
const User = require('./models/User');
const Slot = require('./models/Slot');

const crossHeader = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

module.exports.createUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  //needs some validation - checking for duplicate accounts and password encryption
  connectToDatabase().then(() => {
    User.create(JSON.parse(event.body))
      .then((user) =>
        callback(null, {
          statusCode: 200,
          headers: crossHeader,
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
          headers: crossHeader,
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
          headers: crossHeader,
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
          headers: crossHeader,
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
          headers: crossHeader,
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

//    ----------- Booking slots

module.exports.createSlot = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  //needs some validation - Checking for Admin privileges and neccesary fields are filled
  connectToDatabase().then(() => {
    Slot.create(JSON.parse(event.body))
      .then((slot) =>
        callback(null, {
          statusCode: 200,
          headers: crossHeader,
          body: JSON.stringify(slot),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not create the booking slot.',
        })
      );
  });
};

module.exports.getAllSlots = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Slot.find()
      .then((slots) =>
        callback(null, {
          statusCode: 200,
          headers: crossHeader,
          body: JSON.stringify(slots),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the booking slots.',
        })
      );
  });
};

module.exports.deleteSlot = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Slot.findByIdAndRemove(event.pathParameters.id)
      .then((slot) =>
        callback(null, {
          statusCode: 200,
          headers: crossHeader,
          body: JSON.stringify({ message: 'Removed slot with id: ' + slot._id }),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not find slot to delete.',
        })
      );
  });
};

module.exports.addBooking = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    // console.log(event);
    Slot.findById(event.pathParameters.id)
      .then((slot) => {
        const booking = JSON.parse(event.body);
        slot.booking = { userID: booking.userID, bookingNames: booking.bookingNames };
        slot
          .save()
          .then((slot) =>
            callback(null, {
              statusCode: 200,
              headers: crossHeader,
              body: JSON.stringify({ message: 'Added booking to slot with id: ' + slot._id, booking: slot.booking }),
            })
          )
          .catch((err) =>
            callback(null, {
              statusCode: err.statusCode || 500,
              headers: { 'Content-Type': 'text/plain' },
              body: 'Could not add booking. Error: ' + err,
            })
          );
      })
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not find slot to add booking to.' + err,
        })
      );
  });
};

module.exports.removeBooking = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Slot.findById(event.pathParameters.id)
      .then((slot) => {
        slot.booking.remove();
        slot
          .save()
          .then((slot) =>
            callback(null, {
              statusCode: 200,
              headers: crossHeader,
              body: JSON.stringify({ message: 'Removed booking to slot with id: ' + slot._id }),
            })
          )
          .catch((err) =>
            callback(null, {
              statusCode: err.statusCode || 500,
              headers: { 'Content-Type': 'text/plain' },
              body: 'Could not remove booking.' + err,
            })
          );
      })
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not find slot to remove booking from.',
        })
      );
  });
};
