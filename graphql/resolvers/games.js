//Importing mongoose Schemas
const Game = require('../../models/game');
const Player = require('../../models/player');

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
        })
    },
    searchGamesLowPrice: args => {
        return Game.find({
            "price": {
                $lt: `${args.price}`
            }
        })
    },
    searchGamesGenreWise: args => {
        return Game.find({
            "genre": {
                $regex: `${args.genre}`
            }
        })
    },
    addGame: args => {
        const game = new Game({
            name: args.gameInput.name,
            genre: args.gameInput.genre,
            price: args.gameInput.price,
            ageLimit: args.gameInput.ageLimit,
            creator: '5f0e0fc85f871d2869945250'
        });
        let createdGame;
        return game.save()
            .then(result => {
                createdGame = transformGame(result);
                return Player.findById('5f0e0fc85f871d2869945250')
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
    },
}