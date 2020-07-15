const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true
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
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Player'
        }
    ]
}
);
const Player = mongoose.model('Player', playerSchema);
module.exports = Player;