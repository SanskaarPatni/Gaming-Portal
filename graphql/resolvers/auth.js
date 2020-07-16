const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require('config');
//Importing Mongoose Schema
const Player = require('../../models/player');

module.exports = {
    players: () => {
        return Player.find({}).populate('createdGames').populate('friends')
            .then(players => {
                return players.map(player => {
                    return {
                        ...player._doc,
                        password: null,
                    }
                })
            })
    },
    searchPlayersNameWise: args => {
        return Player.find({
            "name": {
                $regex: `${args.name}`
            }
        }).populate('createdGames')
            .then(players => {
                return players.map(player => {
                    return {
                        ...player._doc,
                        password: null
                    }
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
                return {
                    ...result._doc,
                    password: null,
                    _id: result.id
                }
            })
            .catch(err => {
                throw err;
            })
    },
    addFriend: async (args, req) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        else {
            const player = await Player.findById(req.userId);
            player.friends.push(args.personId);
            return player.save();
        }
    },
    login: async ({ email, password }) => {
        const user = await Player.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist.');
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
    getFriends: async (args, req) => {
        if (!req.isAuth)
            throw new Error('Unauthenticated');
        else {
            const player = await Player.findById(req.userId).populate('friends');
            return player.friends;

        }
    }
}
