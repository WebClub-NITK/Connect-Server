const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const courseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    branch: {
        type: ObjectId,
        ref: "Branch"
    }
})

module.exports = mongoose.model('Course', courseSchema)