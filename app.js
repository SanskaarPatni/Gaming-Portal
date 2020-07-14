const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

//importing models
const Game = require('./models/game');

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
    type Game{
        name:String!
        genre:String!
        price:Float!
        company:String!
    }

    input GameInput{
        name:String!
        genre:String!
        price:Float!
        company:String!
    }

    type RootQuery{
        games:[Game!]!
        searchGamesNameWise(name:String!):[Game!]!
        searchGamesLowPrice(price:Float!):[Game!]!
        searchGamesGenreWise(genre:String!):[Game!]!
        searchGamesCompanyWise(company:String!):[Game!]!
    }

    type RootMutation{
        addGame(gameInput:GameInput):Game 
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
        searchGamesCompanyWise: args => {
            return Game.find({
                "company": {
                    $regex: `${args.company}`
                }
            })
        },
        addGame: args => {
            const game = new Game({
                name: args.gameInput.name,
                genre: args.gameInput.genre,
                company: args.gameInput.company,
                price: args.gameInput.price,
            });
            return game.save();
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