const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require('config');
//Importing Mongoose Schema
const Player = require('../../models/player');

//Import helper functions
const { transformPlayer } = require('./helper');

module.exports = {
    players: () => {
        return Player.find({})
            .then(players => {
                return players.map(player => {
                    return transformPlayer(player)
                })
            })
    },
    searchPlayersNameWise: args => {
        return Player.find({
            "name": {
                $regex: `${args.name}`
            }
        })
            .then(players => {
                return players.map(player => {
                    return transformPlayer(player);
                });
            });
    },
    addPlayer: args => {
        return Player.findOne({ email: args.email }).then(user => {
            if (user) throw new Error('User exists already.');
            return bcrypt.hash(args.password, 12)
        })
            .then(hashedPassword => {
                const player = new Player({
                    email: args.email,
                    password: hashedPassword,
                    name: args.name,
                    age: args.age
                });
                return player.save();
            })
            .then(result => {
                return transformPlayer(result);
            })
            .catch(err => {
                throw err;
            })
    },
    followPlayer: async (args, req) => {
        if (!req.isAuth)
            throw new Error('You need to login to follow players!');
        else {
            const followedPlayer = await Player.findById(args.playerId);
            if (!followedPlayer) {
                throw new Error('No player with such ID')
            }
            else {
                const player = await Player.findById(req.userId);
                player.following.push(args.playerId);
                followedPlayer.notifications.push(`${req.userId} started following you!`);
                await followedPlayer.save();
                await player.save();
                return transformPlayer(followedPlayer);
            }
        }
    },
    login: async ({ email, password }) => {
        const user = await Player.findOne({ email: email });
        if (!user) {
            throw new Error('Player does not exist.');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Invalid Credentials!')
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, config.get('jwtSecret'), {
            expiresIn: '1h'
        });
        return { userId: user.id, token: token, tokenExpiration: 1 }
    },
    getFollowing: async (args, req) => {
        if (!req.isAuth)
            throw new Error('You need to login to view who you are following!');
        else {
            const playerr = await Player.findById(req.userId);
            return playerr.following.map(player => {
                return transformPlayer(player)
            });
        }
    },
    getNotifications: async (args, req) => {
        if (!req.isAuth)
            throw new Error('You need to login to check your notifications!');
        else {
            const player = await Player.findById(req.userId);
            return player.notifications;
        }
    },
}
