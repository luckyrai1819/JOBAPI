const mongoose = require('mongoose')


const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'please provide company name']
    },
    position: {
        type: String,
        required: [true, 'please provide position']
    },
    status: {
        type: String,
        enum: {
            values: ['interviewing', 'completed', 'pending'],
            message: '{VALUE} is invalid'
        },
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: [true, 'please provide user'],
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Job', JobSchema);