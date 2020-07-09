const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Child Schema
const BookingInfo = new Schema({
  userID: {
    type: String,
    required: true,
  },
  bookingNames: {
    type: String,
    required: true,
  },
  dateBooked: {
    type: Date,
    default: Date.now,
  },
});

// Parent Schema
const SlotSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  booking: BookingInfo,
});

module.exports = Slot = mongoose.model('slot', SlotSchema);
