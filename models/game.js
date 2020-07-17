const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    genre: {
        type: String,
        required: true,
    },
    minAge: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    downloads: {
        type: Number,
        default: 0
    },
    prereqGames: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Game'
        }
    ],
}
);
const Game = mongoose.model('Game', gameSchema);
module.exports = Game;