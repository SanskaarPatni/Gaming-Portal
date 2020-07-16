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
        friends:[Player!]
    }

    type AuthData{
        userId:ID!
        token:String!
        tokenExpiration:Int!
    }

    type RootQuery{
        games:[Game!]!
        players:[Player!]!
        bookings:[Booking!]!
        login(email:String!,password:String!):AuthData!
        searchGamesNameWise(name:String!):[Game!]!
        searchGamesLowPrice(price:Float!):[Game!]!
        searchGamesGenreWise(genre:String!):[Game!]!
        searchPlayersNameWise(name:String!):[Player!]!
        getFriends:[Player!]
    }

    type RootMutation{
        addGame(name:String!,genre:String!,price:Float!,ageLimit:Int!):Game 
        addPlayer(email:String!,password:String,name:String!,age:Int!):Player
        addFriend(personId:ID!):Player!
        purchaseGame(gameId:ID!):Booking!
        cancelPurchase(bookingId:ID!):Game!
    }
    schema{
        query:RootQuery
        mutation:RootMutation
    }
    `)


