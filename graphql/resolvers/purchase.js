//Importing Mongoose Schema
const Booking = require('../../models/booking');
const Game = require('../../models/game');
const Player = require('../../models/player');

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
    /*purchaseGame: async (args, req) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        const fetchedGame = await Game.findOne({ _id: args.gameId });
        const fetchedUser = await Player.findById(req.userId);
        if (fetchedGame.ageLimit > fetchedUser.age) {
            throw new Error('You do not have the minimum age required to play this game.')
        }
        else {
            const booking = new Booking({
                player: req.userId,
                game: fetchedGame
            })
            fetchedGame.downloads = +1;
            fetchedGame.save();
            const result = await booking.save();
            return transformBooking(result);
        }
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
    },*/
    purchaseGame: async (args, req) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        else {
            const fetchedGame = await Game.findOne({ _id: args.gameId });
            if (!fetchedGame) {
                throw new Error("No game matching this id");
            }
            const fetchedUser = await Player.findById(req.userId);
            if (fetchedGame.minAge > fetchedUser.age) {
                throw new Error('You do not have the minimum age required to play this game.')
            }
            else {
                const booking = new Booking({
                    player: req.userId,
                    game: fetchedGame
                });
                fetchedGame.downloads += 1;
                await fetchedGame.save();
                fetchedUser.purchasedGames.push(fetchedGame);
                await fetchedUser.save();
                const result = await booking.save();
                return transformBooking(result);
            }
        }
    },
    cancelPurchase: async (args, req) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        else {
            try {
                const booking = await Booking.findById(args.bookingId).populate('game');
                const game = transformGame(booking.game)
                await Booking.deleteOne({ _id: args.bookingId })
                const fetchedUser = await Player.findById(req.userId);
                const index = fetchedUser.purchaseGames.indexOf(game.id);
                if (index > -1) {
                    fetchedUser.purchaseGames.splice(index, 1);
                    await fetchedUser.save();
                }
                return game;
            }
            catch (err) {
                throw err
            }
        }
    }
}