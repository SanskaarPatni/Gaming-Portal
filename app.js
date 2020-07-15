const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

//importing models
const Game = require('./models/game');
const Player = require('./models/player');
const app = express();
//searchGamesCompanyWise(company:String!):[Game!]!
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
    type Game{
        _id:ID!
        name:String!
        genre:String!
        price:Float!
        ageLimit:Int!
        creator:Player!
    }

    type Player{
        _id:ID!
        email:String!
        password:String
        name:String!  
        age:Int! 
        createdGames:[Game!]
    }

    input GameInput{
        name:String!
        genre:String!
        price:Float!
        ageLimit:Int!
    }

    input PlayerInput{
        email:String!
        password:String
        name:String!  
        age:Int! 
    }

    type RootQuery{
        games:[Game!]!
        searchGamesNameWise(name:String!):[Game!]!
        searchGamesLowPrice(price:Float!):[Game!]!
        searchGamesGenreWise(genre:String!):[Game!]!
    }

    type RootMutation{
        addGame(gameInput:GameInput):Game 
        addPlayer(playerInput:PlayerInput):Player
    }
    schema{
        query:RootQuery
        mutation:RootMutation
    }
    `),
    rootValue: {
        games: () => {
            return Game.find({});
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
        // searchGamesCompanyWise: args => {
        //     return Game.find({
        //         "company": {
        //             $regex: `${args.company}`
        //         }
        //     })
        // },
        addGame: args => {
            const game = new Game({
                name: args.gameInput.name,
                genre: args.gameInput.genre,
                price: args.gameInput.price,
                ageLimit: args.gameInput.ageLimit,
                creator: '5f0e0faf5f871d286994524f'
            });
            let createdGame;
            return game.save()
                .then(result => {
                    createdGame = { ...result._doc, _id: result._doc._id.toString() }
                    return Player.findById('5f0e0faf5f871d286994524f')
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
                    return { ...result._doc, password: null, _id: result.id }
                })
                .catch(err => {
                    throw err;
                })
        }
    },
    graphiql: true
}));

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log(err));

app.listen(4000, () => {
    console.log('Listening on PORT 4000');
});