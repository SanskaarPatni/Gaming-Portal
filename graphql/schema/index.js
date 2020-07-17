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
        minAge:Int!
        creator:Player!
        downloads:Int!
    }

    type Player{
        _id:ID!
        email:String!
        password:String
        name:String!  
        age:Int! 
        createdGames:[Game!]
        following:[Player!]
        purchasedGames:[Game!]
    }

    type AuthData{
        userId:ID!
        token:String!
        tokenExpiration:Int!
    }

    type RootQuery{
        games:[Game!]!
        searchGamesNameWise(name:String!):[Game!]!
        searchGamesLowPrice(price:Float!):[Game!]!
        searchGamesGenreWise(genre:String!):[Game!]!
        topthreeDownloads:[Game!]
        players:[Player!]!
        login(email:String!,password:String!):AuthData!
        searchPlayersNameWise(name:String!):[Player!]!
        getFollowing:[Player!]
        getNotifications:[String!]
        bookings:[Booking!]!
    }

    type RootMutation{
        addGame(name:String!,genre:String!,price:Float!,ageLimit:Int!):Game 
        addPlayer(email:String!,password:String!,name:String!,age:Int!):Player
        followPlayer(personId:ID!):Player!
        purchaseGame(gameId:ID!):Booking!
        cancelPurchase(bookingId:ID!):Game!
    }
    schema{
        query:RootQuery
        mutation:RootMutation
    }
    `)


