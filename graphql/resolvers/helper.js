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
const players = playerIds => {
    return PLayer.find({ _id: { $in: playerIds } })
        .then(players => {
            return players.map(player => {
                return transformPlayer(player);
            });
        })
        .catch(err => { throw err });
}
const player = playerId => {
    return Player.findById(playerId)
        .then(player => {
            return transformPlayer(player);
        })
        .catch(err => {
            throw err;
        });
}
const dateToString = date => new Date(date).toISOString();

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking._id,
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
        creator: player.bind(this, game.creator),
        prereqGames: games.bind(this, game.prereqGames)
    };
}

const transformPlayer = player => {
    return {
        ...player._doc,
        _id: player._id,
        password: null,
        createdGames: games.bind(this, player.createdGames),
        purchasedGames: games.bind(this, player.purchasedGames),
        following: players.bind(this, player.following)
    }
}

//Exports 
exports.transformPlayer = transformPlayer;
exports.transformGame = transformGame;
exports.transformBooking = transformBooking;