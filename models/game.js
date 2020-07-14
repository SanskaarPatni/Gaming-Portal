const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prereqSchema = new Schema({
    pregameIds: {
        type: String
    }
});
const gameSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    genre: {
        type: String,
        required: true,
        unique: true
    },
    company: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    },
    //pregameIds: [prereqSchema]
}
);
const Game = mongoose.model('Game', gameSchema);
module.exports = Game;