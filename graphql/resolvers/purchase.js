//Importing Mongoose Schema
const Booking = require('../../models/booking');
const Game = require('../../models/game');

//Importing functions 
const { transformBooking, transformGame } = require('./helper');


module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find({})
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (err) {
            throw err
        }
    },
    purchaseGame: async args => {
        const fetchedGame = await Game.findOne({ _id: args.gameId })
        const booking = new Booking({
            player: '5f0e0fc85f871d2869945250',
            game: fetchedGame
        })
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelPurchase: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('game');
            const game = transformGame(booking.game)
            await Booking.deleteOne({ _id: args.bookingId })
            return game;
        }
        catch (err) {
            throw err
        }
    }
}