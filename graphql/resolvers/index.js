const authResolver = require('./auth');
const gameResolver = require('./games');
const bookingResolver = require('./purchase');

const rootResolver = {
    ...authResolver,
    ...bookingResolver,
    ...gameResolver
};

module.exports = rootResolver;