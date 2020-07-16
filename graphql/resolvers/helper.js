//Importing Mongoose Schema
const Player = require('../../models/player');
const Game = require('../../models/game');


//Code reusability functions
const games = gameIds => {
    return Game.find({ _id: { $in: gameIds } })
        .then(games => {
            return games.map(game => {
                return transformGame(game);
            });
        })
        .catch(err => { throw err });
}

const game = gameId => {
    return Game.findById(gameId)
        .then(game => {
            return transformGame(game);
        })
        .catch(err => { throw err })
}
const player = playerId => {
    return Player.findById(playerId)
        .then(player => {
            return {
                ...player._doc,
                _id: player._id,
                createdGames: games.bind(this, player.createdGames)
            }
        })
        .catch(err => {
            throw err;
        });
}
const dateToString = date => new Date(date).toISOString();
const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        player: player.bind(this, booking._doc.player),
        game: game.bind(this, booking._doc.game),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}
const transformGame = game => {
    return {
        ...game._doc,
        _id: game._id,
        creator: player.bind(this, game.creator)
    };
}



exports.transformGame = transformGame;
exports.transformBooking = transformBooking;