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
            throw new Error('You need to login to add games!');
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
    addPrereqGames: async (args, req) => {
        if (!req.isAuth)
            throw new Error('You need to login to add prereq games!');
        else {
            const game = await Game.findById(args.gameId);
            if (game.creator != req.userId) {
                throw new Error('You need to be the creator of the game to add prereq games!');
            }
            for (var i = 0; i < args.arrayIds.length; i++) {
                const gam = await Game.findById(args.arrayIds[i]);
                if (!gam) {
                    throw new Error(`Invalid id for a prereq game ${args.arrayIds[i]} ..Previous ids added as prereq games`);
                }
                else {
                    game.prereqGames.push(gam);
                }
            }
            return game.save();
        }
    }
}