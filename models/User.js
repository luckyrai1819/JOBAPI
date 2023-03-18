const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide username'],
        minLength: 2,
        maxLength: 20
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'invalid email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'provide password'],
        minLength: 3
    }
})

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    const encodedPWD = await bcrypt.hash(this.password, salt);
    this.password = encodedPWD;
})

userSchema.methods.createToken = async function () {
    const token = await jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SEC, { expiresIn: process.env.JWT_LIFETIME })
    return token;
}
userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;

}
module.exports = mongoose.model('User', userSchema);