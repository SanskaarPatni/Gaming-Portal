const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },
    player: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    }
}, { timestamps: true }
);
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;