const bcrypt = require('bcryptjs')
const StatusCodes = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !password || !email)
        throw new BadRequestError('please provide name, password and email');
    const user = await User.create({ name, email, password })
    const token = await user.createToken();
    res.status(StatusCodes.CREATED).json({ user, token })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new BadRequestError('please provide credentials');

    const user = await User.findOne({ email });
    if (!user)
        throw new UnauthenticatedError('this email does not exist in db');
    const isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword)
        throw new UnauthenticatedError('invalid password');
    const token = await user.createToken();
    res.status(StatusCodes.OK).json({ user, token });
}

module.exports = { register, login }