const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];//Bearer: dafsafa
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    try {
        decodedToken = jwt.verify(token, config.get('jwtSecret'));
    }
    catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}
