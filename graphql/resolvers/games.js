//Importing mongoose Schemas
const Game = require('../../models/game');
const Player = require('../../models/player');
const Booking = require('../../models/booking')
//Importing function from helpers
const { transformGame } = require('./helper');

module.exports = {
    games: () => {
        return Game.find({})
            .then(games => {
                return games.map(game => {
                    return transformGame(game);
                });
            })
            .catch(err => { throw err })
    },
    searchGamesNameWise: args => {
        return Game.find({
            "name": {
                $regex: `${args.name}`
            }
        }).then(games => {
            return games.map(game => {
                return transformGame(game);
            });
        })
            .catch(err => { throw err })
    },
    searchGamesLowPrice: args => {
        return Game.find({
            "price": {
                $lt: `${args.price}`
            }
        }).then(games => {
            return games.map(game => {
                return transformGame(game);
            });
        })
            .catch(err => { throw err })
    },
    searchGamesGenreWise: args => {
        return Game.find({
            "genre": {
                $regex: `${args.genre}`
            }
        }).then(games => {
            return games.map(game => {
                return transformGame(game);
            });
        })
            .catch(err => { throw err })
    },
    topthreeDownloads: args => {
        return Game.find({}).sort({ downloads: -1 }).limit(3);
    },
    addGame: (args, req) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        else {
            const game = new Game({
                name: args.name,
                genre: args.genre,
                price: args.price,
                minAge: args.minAge,
                creator: req.userId
            });
            let createdGame;
            return game.save()
                .then(result => {
                    createdGame = transformGame(result);
                    return Player.findById(req.userId)
                })
                .then(player => {
                    if (!player) {
                        throw new Error('Player does not exist!');
                    }
                    player.createdGames.push(game);
                    return player.save();
                })
                .then(result => {
                    return createdGame;
                })
                .catch(err => {
                    console.log(err);
                    throw (err);
                })
        }
    },
}