const { buildSchema } = require('graphql');


module.exports = buildSchema(`

    type Booking{
        _id:ID!
        player:Player!
        game:Game!
        createdAt:String!
        updatedAt:String!
    }
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
        players:[Player!]!
        searchGamesNameWise(name:String!):[Game!]!
        searchGamesLowPrice(price:Float!):[Game!]!
        searchGamesGenreWise(genre:String!):[Game!]!
        searchPlayersNameWise(name:String!):[Player!]!
        bookings:[Booking!]!
    }

    type RootMutation{
        addGame(gameInput:GameInput):Game 
        addPlayer(playerInput:PlayerInput):Player
        purchaseGame(gameId:ID!):Booking!
        cancelPurchase(bookingId:ID!):Game!
    }
    schema{
        query:RootQuery
        mutation:RootMutation
    }
    `)


