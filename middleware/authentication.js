
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors')


const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new UnauthenticatedError('token is not present')
    const token = authHeader.split(' ')[1];
    try {
        const payload = await jwt.verify(token, process.env.JWT_SEC);
        req.user = { userId: payload.userId, name: payload.name };
        next();
    } catch (error) {
        throw new UnauthenticatedError('authorization invalid')
    }

}

module.exports = auth;