//Importing Mongoose Schema
const Booking = require('../../models/booking');
const Game = require('../../models/game');

//Importing functions 
const { transformBooking, transformGame } = require('./helper');


module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        try {
            const bookings = await Booking.find({})
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (err) {
            throw err
        }
    },
    purchaseGame: async (args, req) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        const fetchedGame = await Game.findOne({ _id: args.gameId })
        const booking = new Booking({
            player: req.userId,
            game: fetchedGame
        })
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelPurchase: async (args, req) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
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