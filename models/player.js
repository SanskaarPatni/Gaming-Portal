const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdGames: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Game'
        }
    ],
    purchasedGames: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Game'
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Player'
        }
    ],
    notifications: [
        {
            type: String,
        }
    ]
}
);
const Player = mongoose.model('Player', playerSchema);
module.exports = Player;