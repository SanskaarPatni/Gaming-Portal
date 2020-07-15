const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
//Importing Mongoose Schema
const Player = require('../../models/player');

module.exports = {
    players: () => {
        return Player.find({}).populate('createdGames')
            .then(players => {
                return players.map(player => {
                    return {
                        ...player._doc, password: null
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
        return Player.findOne({ email: args.playerInput.email }).then(user => {
            if (user) throw new Error('User exists already.');
            return bcrypt.hash(args.playerInput.password, 12)
        })
            .then(hashedPassword => {
                const player = new Player({
                    email: args.playerInput.email,
                    password: hashedPassword,
                    name: args.playerInput.name,
                    age: args.playerInput.age
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
    login: async ({ email, password }) => {
        const user = await Player.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist.');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Invalid Credentials!')
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'secretkey', {
            expiresIn: '1h'
        });
        return { userId: user.id, token: token, tokenExpiration: 1 }
    }
}
