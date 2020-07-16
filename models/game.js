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
    ageLimit: {
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
    }
}
);
const Game = mongoose.model('Game', gameSchema);
module.exports = Game;